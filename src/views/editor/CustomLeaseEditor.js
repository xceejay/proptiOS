import { Lock, LockOpen, TextFields } from '@mui/icons-material'
import { Box, Button, Stack, Typography } from '@mui/material'
import { useCallback, useRef, useState } from 'react'
import { LinkBubbleMenu, MenuButton, RichTextEditor, RichTextReadOnly, TableBubbleMenu, insertImages } from 'mui-tiptap'
import EditorMenuControls from './EditorMenuControls'
import toast from 'react-hot-toast'
import useExtensions from './useExtensions'

const CustomLeaseEditor = props => {
  const {
    defaultLeaseText,
    formVariables,
    submittedContent,
    setSubmittedContent,
    rteRef,
    originalContent,
    setOriginalContent,
    handleReplaceVars
  } = props
  const extensions = useExtensions({
    placeholder: 'Add your own content here...'
  })

  const [isEditable, setIsEditable] = useState(true)

  const [showMenuBar, setShowMenuBar] = useState(false)

  const handleNewImageFiles = useCallback((files, insertPosition) => {
    if (!rteRef.current?.editor) {
      return
    }

    const attributesForImageFiles = files.map(file => ({
      src: URL.createObjectURL(file),
      alt: file.name
    }))

    insertImages({
      images: attributesForImageFiles,
      editor: rteRef.current.editor,
      insertPosition
    })
  }, [])

  const handleDrop = useCallback(
    (view, event, _slice, _moved) => {
      if (!(event instanceof DragEvent) || !event.dataTransfer) {
        return false
      }

      const imageFiles = fileListToImageFiles(event.dataTransfer.files)
      if (imageFiles.length > 0) {
        const insertPosition = view.posAtCoords({
          left: event.clientX,
          top: event.clientY
        })?.pos

        handleNewImageFiles(imageFiles, insertPosition)

        event.preventDefault()
        return true
      }

      return false
    },
    [handleNewImageFiles]
  )

  function fileListToImageFiles(fileList) {
    // You may want to use a package like attr-accept
    // (https://www.npmjs.com/package/attr-accept) to restrict to certain file
    // types.
    return Array.from(fileList).filter(file => {
      const mimeType = (file.type || '').toLowerCase()
      return mimeType.startsWith('image/')
    })
  }

  const handlePaste = useCallback(
    (_view, event, _slice) => {
      if (!event.clipboardData) {
        return false
      }

      const pastedImageFiles = fileListToImageFiles(event.clipboardData.files)
      if (pastedImageFiles.length > 0) {
        handleNewImageFiles(pastedImageFiles)
        return true
      }

      return false
    },
    [handleNewImageFiles]
  )

  const handleUndoReplace = () => {
    if (!rteRef.current?.editor || !originalContent) return

    // Restore the original content
    rteRef.current.editor.commands.setContent(originalContent)

    // Clear the original content state after undo
    setOriginalContent('')
  }

  // const exampleContent =
  //   '<h2 style="text-align: center">Hey there 👋</h2><p>This is a <em>basic</em> example of <code>mui-tiptap</code>, which combines <a target="_blank" rel="noopener noreferrer nofollow" href="https://tiptap.dev/">Tiptap</a> with customizable <a target="_blank" rel="noopener noreferrer nofollow" href="https://mui.com/">MUI (Material-UI)</a> styles, plus a suite of additional components and extensions! Sure, there are <strong>all <em>kinds</em> of <s>text</s> <u>formatting</u> options</strong> you’d probably expect from a rich text editor. But wait until you see the <span data-type="mention" data-id="15" data-label="Axl Rose">@Axl Rose</span> mentions and lists:</p><ul><li><p>That’s a bullet list with one …</p></li><li><p>… or two list items.</p></li></ul><p>Isn’t that great? And all of that is editable. <strong><span style="color: #ff9900">But wait, </span><span style="color: #403101"><mark data-color="#ffd699" style="background-color: #ffd699; color: inherit">there’s more!</mark></span></strong> Let’s try a code block:</p><pre><code class="language-css">body {\n  display: none;\n}</code></pre><p></p><p>That’s only the tip of the iceberg. Feel free to add and resize images:</p><img height="auto" src="https://picsum.photos/600/400" alt="random image" width="350" style="aspect-ratio: 3 / 2"><p></p><p>Organize information in tables:</p><table><tbody><tr><th colspan="1" rowspan="1"><p>Name</p></th><th colspan="1" rowspan="1"><p>Role</p></th><th colspan="1" rowspan="1"><p>Team</p></th></tr><tr><td colspan="1" rowspan="1"><p>Alice</p></td><td colspan="1" rowspan="1"><p>PM</p></td><td colspan="1" rowspan="1"><p>Internal tools</p></td></tr><tr><td colspan="1" rowspan="1"><p>Bob</p></td><td colspan="1" rowspan="1"><p>Software</p></td><td colspan="1" rowspan="1"><p>Infrastructure</p></td></tr></tbody></table><p></p><p>Or write down your groceries:</p><ul data-type="taskList"><li data-checked="true" data-type="taskItem"><label><input type="checkbox" checked="checked"><span></span></label><div><p>Milk</p></div></li><li data-checked="false" data-type="taskItem"><label><input type="checkbox"><span></span></label><div><p>Eggs</p></div></li><li data-checked="false" data-type="taskItem"><label><input type="checkbox"><span></span></label><div><p>Sriracha</p></div></li></ul><blockquote><p>Wow, that’s amazing. Good work! 👏 <br>— Mom</p></blockquote><p>Give it a try and click around!</p>'

  return (
    <Box width={1}>
      <RichTextEditor
        ref={rteRef}
        extensions={extensions}
        content={defaultLeaseText}
        editable={isEditable}
        editorProps={{
          handleDrop: handleDrop,
          handlePaste: handlePaste
        }}
        renderControls={() => <EditorMenuControls />}
        RichTextFieldProps={{
          variant: 'standard',
          MenuBarProps: {
            hide: !showMenuBar
          },
          footer: (
            <Stack
              direction='row-reverse'
              spacing={2}
              sx={{
                py: 1,
                px: 1.5
              }}
            >
              {/* Undo Button */}
              {/* <Button
                variant='contained'
                size='small'
                onClick={handleUndoReplace}
                disabled={!originalContent} // Disable if there's no original content to undo
              >
                Undo
              </Button> */}

              <MenuButton
                value='formatting'
                tooltipLabel={isEditable ? 'Prevent edits (use read-only mode)' : 'Allow edits'}
                size='small'
                onClick={() => setIsEditable(currentState => !currentState)}
                selected={!isEditable}
                IconComponent={isEditable ? Lock : LockOpen}
              />
              <MenuButton
                value='formatting'
                tooltipLabel={showMenuBar ? 'Hide formatting' : 'Show formatting'}
                size='small'
                onClick={() => setShowMenuBar(currentState => !currentState)}
                selected={showMenuBar}
                IconComponent={TextFields}
              />
              <Button
                variant='contained'
                size='small'
                onClick={() => {
                  const currentHtmlContent = rteRef.current?.editor?.getHTML() ?? ''
                  handleReplaceVars(currentHtmlContent)
                }}
              >
                Insert Details
              </Button>
              <Button
                variant='contained'
                size='small'
                onClick={() => {
                  setSubmittedContent(rteRef.current?.editor?.getHTML() ?? '')

                  alert('submitted content set')
                }}
              >
                Save
              </Button>
            </Stack>
          )
        }}
      >
        {() => (
          <>
            <LinkBubbleMenu />
            <TableBubbleMenu />
          </>
        )}
      </RichTextEditor>
    </Box>
  )
}
export default CustomLeaseEditor
