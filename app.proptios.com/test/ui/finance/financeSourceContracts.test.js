import fs from 'node:fs'
import path from 'node:path'

describe('finance source contracts', () => {
  it('passes finance data to the expenses table and surfaces statement errors', () => {
    const expensesParentSource = fs.readFileSync(
      path.resolve(process.cwd(), 'src/ui/finance/ParentFinanceViewExpenses.js'),
      'utf8'
    )
    const expensesTableSource = fs.readFileSync(
      path.resolve(process.cwd(), 'src/ui/finance/FinanceExpensesTable.js'),
      'utf8'
    )
    const statementsParentSource = fs.readFileSync(
      path.resolve(process.cwd(), 'src/ui/finance/ParentFinanceViewStatements.js'),
      'utf8'
    )
    const financeContextSource = fs.readFileSync(path.resolve(process.cwd(), 'src/context/FinanceContext.js'), 'utf8')
    const receiptSource = fs.readFileSync(
      path.resolve(process.cwd(), 'src/pages/finance/receipt/view/[id].js'),
      'utf8'
    )

    expect(expensesParentSource).toContain('finance.getAllTransactions(')
    expect(expensesParentSource).toContain('<FinanceExpensesTable financeData={expensesData} errorMessage={errorMessage}></FinanceExpensesTable>')
    expect(expensesTableSource).toContain('const resolveExpenseRows = financeData => {')
    expect(expensesTableSource).toContain("{errorMessage ? <Alert severity='error'>{errorMessage}</Alert> : null}")
    expect(statementsParentSource).toContain('const [errorMessage, setErrorMessage] = useState')
    expect(statementsParentSource).toContain('<FinanceStatementsTable financeData={transactions} errorMessage={errorMessage}></FinanceStatementsTable>')
    expect(financeContextSource).toContain('const getAllTransactions = (params, successCallback, errorCallback) => {')
    expect(financeContextSource).toContain('params\n      })')
    expect(receiptSource).toContain('normalizeTransactionPreview')
    expect(receiptSource).toContain('if (errorMessage)')
  })
})
