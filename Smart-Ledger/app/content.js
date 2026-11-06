// Fixed curriculum. Monetary values use whole Kenyan shillings.
const accounts = ['Cash','Bank','Inventory','Equipment','Trade Receivables','Trade Payables','Capital','Drawings','Sales','Rent Expense','Delivery Expense'];
const kinds = ['asset','asset','asset','asset','asset','liability','capital','drawings','income','expense','expense'];
const rules = [
 ['Owner invests cash',0,6,'Cash comes into the shop. The owner’s capital increases.'],
 ['Cash sale',0,8,'Cash and sales income both increase.'],
 ['Stock bought on credit',2,5,'Inventory rises and the shop owes its supplier.'],
 ['Rent paid by bank',9,1,'Rent expense increases. The bank balance falls.'],
 ['Customer pays an existing debt into the bank',1,4,'Bank increases. The amount owed by the customer falls.'],
 ['Owner takes cash for personal use',7,0,'Drawings increase. The shop has less cash.']
];
const samples = [
 ['S-01','Cash sale',20000,0,8,1],['S-02','Rent paid by bank',25000,1,9,3],
 ['S-03','Customer settles an earlier credit sale',18000,1,8,4],
 ['S-04','Owner takes cash for personal use',5000,10,0,5],['S-05','Stock bought on credit',40000,2,5,2]
];
const journal = [
 ['Cash sales',60000,0,8],['Stock bought on credit',40000,2,5],['Rent paid by bank',25000,9,1],['Credit sale',30000,4,8],
 ['Customer pays into bank',18000,1,4],['Supplier paid from bank',15000,5,1],['Owner takes cash',5000,7,0],['Delivery paid in cash',4500,10,0]
];
const opening=[20000,150000,80000,100000,0,0,-350000,0,0,0,0];
const groups=['Normal','Rule check','Routine fault','Balanced but wrong'];
// label, amount, debit index, credit index, category, mapping index or null, fault or null
const cases=[
 ['Cash sale',12000,0,8,0,null,null],['Credit sale',30000,4,8,0,null,null],['Stock bought on credit',40000,2,5,0,null,null],
 ['Rent paid by bank',25000,9,1,1,3,null],['Owner takes cash',5000,7,0,1,5,null],['Customer pays into bank',18000,1,4,1,4,null],
 ['Owner invests cash',50000,0,6,1,0,null],['Supplier paid from bank',15000,5,1,2,null,'F1'],
 ['Delivery paid in cash',4500,10,0,2,null,'F2'],['Equipment bought for cash',20000,3,0,3,null,'F3']
];
const routines=['Pay supplier','Post delivery amount','Classify equipment purchases'];
const errors=['One-sided posting','Transposition','Reversed sides','Wrong account'];
const auditOptions=['Change the report headings','Compare each posting with its account-type rules','Hide the accounts that look wrong'];
const corrections=[
 ['Debit Trade Payables / Credit Suspense · 15,000','Debit Trade Payables / Credit Bank · 15,000','Debit Delivery Expense / Credit Suspense · 14,100'],
 ['Debit Cash / Credit Delivery Expense · 900','Debit Suspense / Credit Delivery Expense · 900','Debit Delivery Expense / Credit Suspense · 900']
];
const handovers=['Account types determine each side. Trace differences through suspense. Equal totals alone cannot establish accuracy.','Equal trial balance totals prove that all entries are correct.','Configure the debit and credit accounts for each transaction type.'];
const questions=['Which transaction type was easiest to get the debit and credit sides wrong on, and why?','How did you decide whether the trial balance difference came from one error or more than one?','Why does clearing a suspense account not fix the cause of an error?','Which test case showed an error that a balanced trial balance would not reveal?','When would you trust a system’s automatic posting, and what checks would you keep?'];
const lessons=['Every entry has two sides','Trace a difference before clearing it','A balanced trial balance is not proof of accuracy'];
const intro=[
 ['Narrator','Welcome to Zuri Home Supplies, a growing homeware shop in Nairobi. The shop has started using Smart Ledger, a system that posts each transaction to the accounts automatically.'],
 ['Grace','The system records everything for me now. But the trial balance does not balance, and I cannot tell whether the postings are right.'],
 ['Narrator','You are joining Grace as a junior accounts systems assistant. Here is the plan: set the posting rules, trace the errors in the ledger, then test the fixes and hand over.'],
 ['Narrator','You will be assessed on posting rules, ledger and trial balance skills, error correction, testing, and your explanation. Speed is not scored. All figures are fictional.'],
 ['Narrator','Press Start when you are ready.']
];
const briefings=[
 ['Some of these look wrong to me, but I cannot tell why. What should the system be doing?', 'Open the rule sheet and look at what the system posted for each sample transaction. Then decide your first debugging action.'],
 ['The system will not let me close the month. It has parked the difference in a suspense account, but nobody knows what it is.', 'The corrected rules apply to new postings. But the first run left errors in the ledger. Start by listing each account balance in the debit or credit column.'],
 ['The books balance now. How do I know the system will not make the same mistakes next month?', 'Choose test cases that cover typical transactions, the rules you set, the faults found in the ledger, and one case where the trial balance could balance but the entry is wrong. Predict first, then run, then compare, then revise.'],
 ['Now every entry has two sides, and the system tells me when something is off.', 'The debrief panel shows your final score, your test report, and the decisions that shaped them.']
];
