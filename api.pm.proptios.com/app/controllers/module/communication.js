const mysql_db = require("../../config/db.mysql");
const jwtMiddleware = require("../../middleware/jwt");
const acl = require("../../middleware/acl");

const PREFIX = "/communication";
const ALLOWED_ROLES = [
  "property_owner",
  "property_manager",
  "property_coordinator",
  "maintenance_worker",
];

const ISSUE_STATUS = ["Open", "In Progress", "Closed"];

const issueSelect = `
  SELECT
    issues.id,
    issues.title,
    issues.description,
    issues.status,
    issues.date,
    issues.created_at,
    issues.updated_at,
    issues.reporter_id,
    issues.reporter_user_type,
    CASE
      WHEN issues.reporter_user_type = 'pm_user' THEN reporter_pm.name
      WHEN issues.reporter_user_type = 'tenant' THEN reporter_tenant.name
      ELSE NULL
    END AS reporter_name,
    CASE
      WHEN issues.reporter_user_type = 'pm_user' THEN reporter_pm.email
      WHEN issues.reporter_user_type = 'tenant' THEN reporter_tenant.email
      ELSE NULL
    END AS reporter_email,
    reporter_property.id AS reporter_property_id,
    reporter_property.property_name AS reporter_property_name,
    reporter_unit.id AS reporter_unit_id,
    reporter_unit.name AS reporter_unit_name
  FROM issues
  LEFT JOIN pm_users AS reporter_pm
    ON issues.reporter_user_type = 'pm_user'
   AND reporter_pm.id = issues.reporter_id
   AND reporter_pm.deleted_at IS NULL
  LEFT JOIN tenants AS reporter_tenant
    ON issues.reporter_user_type = 'tenant'
   AND reporter_tenant.id = issues.reporter_id
   AND reporter_tenant.deleted_at IS NULL
  LEFT JOIN properties AS reporter_property
    ON reporter_property.id = reporter_tenant.property_id
   AND reporter_property.deleted_at IS NULL
  LEFT JOIN units AS reporter_unit
    ON reporter_unit.tenant_id = reporter_tenant.id
   AND reporter_unit.deleted_at IS NULL
`;

const issueVisibility = `
  issues.deleted_at IS NULL
  AND (
    (issues.reporter_user_type = 'pm_user' AND reporter_pm.site_id = ?)
    OR
    (issues.reporter_user_type = 'tenant' AND reporter_tenant.site_id = ?)
  )
`;

const commentSelect = `
  SELECT
    issue_comments.id,
    issue_comments.issue_id,
    issue_comments.text,
    issue_comments.timestamp,
    issue_comments.created_at,
    issue_comments.updated_at,
    issue_comments.commenter_id,
    issue_comments.commenter_user_type,
    CASE
      WHEN issue_comments.commenter_user_type = 'pm_user' THEN commenter_pm.name
      WHEN issue_comments.commenter_user_type = 'tenant' THEN commenter_tenant.name
      ELSE NULL
    END AS commenter_name,
    CASE
      WHEN issue_comments.commenter_user_type = 'pm_user' THEN commenter_pm.email
      WHEN issue_comments.commenter_user_type = 'tenant' THEN commenter_tenant.email
      ELSE NULL
    END AS commenter_email
  FROM issue_comments
  LEFT JOIN pm_users AS commenter_pm
    ON issue_comments.commenter_user_type = 'pm_user'
   AND commenter_pm.id = issue_comments.commenter_id
   AND commenter_pm.deleted_at IS NULL
  LEFT JOIN tenants AS commenter_tenant
    ON issue_comments.commenter_user_type = 'tenant'
   AND commenter_tenant.id = issue_comments.commenter_id
   AND commenter_tenant.deleted_at IS NULL
  WHERE issue_comments.deleted_at IS NULL
    AND issue_comments.issue_id IN (?)
  ORDER BY issue_comments.timestamp ASC, issue_comments.id ASC
`;

const issueAttachmentSelect = `
  SELECT
    id,
    issue_id,
    comment_id,
    name,
    type,
    url,
    created_at,
    updated_at
  FROM issue_attachments
  WHERE deleted_at IS NULL
    AND issue_id IN (?)
  ORDER BY created_at ASC, id ASC
`;

function serializeIssueRow(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    status: row.status,
    date: row.date,
    created_at: row.created_at,
    updated_at: row.updated_at,
    reporter: {
      id: row.reporter_id,
      name: row.reporter_name,
      email: row.reporter_email,
      user_type: row.reporter_user_type,
      property:
        row.reporter_property_id != null
          ? {
              id: row.reporter_property_id,
              name: row.reporter_property_name,
            }
          : null,
      unit:
        row.reporter_unit_id != null
          ? {
              id: row.reporter_unit_id,
              name: row.reporter_unit_name,
            }
          : null,
    },
    attachments: [],
    comments: [],
  };
}

function serializeCommentRow(row) {
  return {
    id: row.id,
    issueId: row.issue_id,
    text: row.text,
    timestamp: row.timestamp,
    created_at: row.created_at,
    updated_at: row.updated_at,
    commenter: {
      id: row.commenter_id,
      name: row.commenter_name,
      email: row.commenter_email,
      user_type: row.commenter_user_type,
    },
    attachments: [],
  };
}

async function fetchIssues(connection, siteId, issueId = null) {
  const params = [siteId, siteId];
  let query = `${issueSelect} WHERE ${issueVisibility}`;

  if (issueId != null) {
    query += " AND issues.id = ?";
    params.push(issueId);
  }

  query += " ORDER BY issues.updated_at DESC, issues.id DESC";

  const [issueRows] = await connection.query(query, params);

  if (!issueRows.length) {
    return issueId != null ? null : [];
  }

  const issues = issueRows.map(serializeIssueRow);
  const issuesById = new Map(issues.map((issue) => [issue.id, issue]));
  const issueIds = issues.map((issue) => issue.id);

  const [attachmentRows] = await connection.query(issueAttachmentSelect, [issueIds]);
  for (const attachment of attachmentRows) {
    if (attachment.comment_id == null) {
      issuesById.get(attachment.issue_id)?.attachments.push({
        id: attachment.id,
        name: attachment.name,
        type: attachment.type,
        url: attachment.url,
        created_at: attachment.created_at,
        updated_at: attachment.updated_at,
      });
    }
  }

  const [commentRows] = await connection.query(commentSelect, [issueIds]);
  const commentsById = new Map();

  for (const row of commentRows) {
    const comment = serializeCommentRow(row);
    commentsById.set(comment.id, comment);
    issuesById.get(comment.issueId)?.comments.push(comment);
  }

  for (const attachment of attachmentRows) {
    if (attachment.comment_id != null) {
      commentsById.get(attachment.comment_id)?.attachments.push({
        id: attachment.id,
        name: attachment.name,
        type: attachment.type,
        url: attachment.url,
        created_at: attachment.created_at,
        updated_at: attachment.updated_at,
      });
    }
  }

  return issueId != null ? issues[0] : issues;
}

async function ensureVisibleIssue(connection, siteId, issueId) {
  const issue = await fetchIssues(connection, siteId, issueId);
  return issue || null;
}

const routes = (app) => {
  app.get(
    PREFIX + "/issues",
    jwtMiddleware,
    acl(ALLOWED_ROLES),
    async (req, res) => {
      try {
        const issues = await fetchIssues(mysql_db, req.user.site_id);
        return res.status(200).json({
          status: "SUCCESS",
          data: issues,
          description: "Issues fetched successfully",
        });
      } catch (error) {
        console.error("Error fetching communication issues:", error);
        return res.status(500).json({
          status: "FAILED",
          description: "Server Error: Failed to fetch issues",
        });
      }
    }
  );

  app.get(
    PREFIX + "/issues/:id",
    jwtMiddleware,
    acl(ALLOWED_ROLES),
    async (req, res) => {
      try {
        const issue = await ensureVisibleIssue(
          mysql_db,
          req.user.site_id,
          Number.parseInt(req.params.id, 10)
        );

        if (!issue) {
          return res.status(404).json({
            status: "FAILED",
            description: "Issue not found",
          });
        }

        return res.status(200).json({
          status: "SUCCESS",
          data: issue,
          description: "Issue fetched successfully",
        });
      } catch (error) {
        console.error("Error fetching communication issue:", error);
        return res.status(500).json({
          status: "FAILED",
          description: "Server Error: Failed to fetch issue",
        });
      }
    }
  );

  app.post(
    PREFIX + "/issues",
    jwtMiddleware,
    acl(ALLOWED_ROLES),
    async (req, res) => {
      const { title, description } = req.body || {};

      if (!title || !String(title).trim() || !description || !String(description).trim()) {
        return res.status(400).json({
          status: "FAILED",
          description: "Title and description are required",
        });
      }

      let connection;
      try {
        connection = await mysql_db.getConnection();
        const [result] = await connection.query(
          `
            INSERT INTO issues (
              title,
              description,
              status,
              date,
              reporter_id,
              reporter_user_type
            ) VALUES (?, ?, 'Open', NOW(), ?, 'pm_user')
          `,
          [String(title).trim(), String(description).trim(), req.user.id]
        );

        const issue = await fetchIssues(connection, req.user.site_id, result.insertId);
        return res.status(201).json({
          status: "SUCCESS",
          data: issue,
          description: "Issue created successfully",
        });
      } catch (error) {
        console.error("Error creating communication issue:", error);
        return res.status(500).json({
          status: "FAILED",
          description: "Server Error: Failed to create issue",
        });
      } finally {
        connection?.release?.();
      }
    }
  );

  app.post(
    PREFIX + "/issues/:id/comments",
    jwtMiddleware,
    acl(ALLOWED_ROLES),
    async (req, res) => {
      const issueId = Number.parseInt(req.params.id, 10);
      const text = String(req.body?.text || "").trim();

      if (!text) {
        return res.status(400).json({
          status: "FAILED",
          description: "Comment text is required",
        });
      }

      let connection;
      try {
        connection = await mysql_db.getConnection();
        const visibleIssue = await ensureVisibleIssue(connection, req.user.site_id, issueId);

        if (!visibleIssue) {
          return res.status(404).json({
            status: "FAILED",
            description: "Issue not found",
          });
        }

        const [result] = await connection.query(
          `
            INSERT INTO issue_comments (
              issue_id,
              text,
              commenter_id,
              commenter_user_type
            ) VALUES (?, ?, ?, 'pm_user')
          `,
          [issueId, text, req.user.id]
        );

        const [rows] = await connection.query(
          `
            SELECT
              issue_comments.id,
              issue_comments.issue_id,
              issue_comments.text,
              issue_comments.timestamp,
              issue_comments.created_at,
              issue_comments.updated_at,
              issue_comments.commenter_id,
              issue_comments.commenter_user_type,
              commenter_pm.name AS commenter_name,
              commenter_pm.email AS commenter_email
            FROM issue_comments
            LEFT JOIN pm_users AS commenter_pm
              ON commenter_pm.id = issue_comments.commenter_id
            WHERE issue_comments.id = ?
          `,
          [result.insertId]
        );

        return res.status(201).json({
          status: "SUCCESS",
          data: serializeCommentRow(rows[0]),
          description: "Comment added successfully",
        });
      } catch (error) {
        console.error("Error creating issue comment:", error);
        return res.status(500).json({
          status: "FAILED",
          description: "Server Error: Failed to add comment",
        });
      } finally {
        connection?.release?.();
      }
    }
  );

  app.patch(
    PREFIX + "/issues/:id/status",
    jwtMiddleware,
    acl(ALLOWED_ROLES),
    async (req, res) => {
      const issueId = Number.parseInt(req.params.id, 10);
      const status = String(req.body?.status || "").trim();

      if (!ISSUE_STATUS.includes(status)) {
        return res.status(400).json({
          status: "FAILED",
          description: "Invalid issue status",
        });
      }

      let connection;
      try {
        connection = await mysql_db.getConnection();
        const visibleIssue = await ensureVisibleIssue(connection, req.user.site_id, issueId);

        if (!visibleIssue) {
          return res.status(404).json({
            status: "FAILED",
            description: "Issue not found",
          });
        }

        await connection.query(
          "UPDATE issues SET status = ?, updated_at = NOW() WHERE id = ?",
          [status, issueId]
        );

        const issue = await fetchIssues(connection, req.user.site_id, issueId);
        return res.status(200).json({
          status: "SUCCESS",
          data: issue,
          description: "Issue status updated successfully",
        });
      } catch (error) {
        console.error("Error updating issue status:", error);
        return res.status(500).json({
          status: "FAILED",
          description: "Server Error: Failed to update issue status",
        });
      } finally {
        connection?.release?.();
      }
    }
  );
};

module.exports = {
  routes,
};
