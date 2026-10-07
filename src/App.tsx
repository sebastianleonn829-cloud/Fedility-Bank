import { useState } from 'react';
import { api } from '@appdeploy/client';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Bell,
  ChevronRight,
  CircleHelp,
  CreditCard,
  Eye,
  EyeOff,
  Home,
  LayoutGrid,
  LockKeyhole,
  Menu,
  ReceiptText,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  WalletCards,
  X,
} from 'lucide-react';
import { ArrowLeftRight, CheckCircle2, Smartphone, Upload } from 'lucide-react';

const VERIFIED_EMAIL = 'Sebastianleonn829@gmail.com';

const accounts = [
  { name: 'Everyday Checking', number: '•••• 4821', balance: 1250000, available: 1249875.4, tone: 'primary' },
  { name: '401(k) Retirement', number: '•••• 1070', balance: 70000, available: null, tone: 'dark' },
];

const transactions = [
  { merchant: 'Demo Direct Deposit', date: 'Oct 03', amount: 4500, icon: ArrowDownLeft },
  { merchant: 'Harbor Market', date: 'Oct 02', amount: -126.48, icon: ArrowUpRight },
  { merchant: 'Northstar Utilities', date: 'Sep 30', amount: -184.21, icon: ArrowUpRight },
  { merchant: 'Demo Transfer', date: 'Sep 28', amount: 1200, icon: ArrowDownLeft },
];

const navItems = [
  ['Overview', Home],
  ['Accounts', WalletCards],
  ['Transfers', Send],
  ['Transactions', ReceiptText],
  ['Cards', CreditCard],
  ['Statements', ReceiptText],
  ['Settings', Settings],
];

function money(value: number) {
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

function App() {
  const [signedIn, setSignedIn] = useState(false);
  const [verificationStep, setVerificationStep] = useState(false);
  const [signupStep, setSignupStep] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState('Overview');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupContact, setSignupContact] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [notice, setNotice] = useState('');
  const [sending, setSending] = useState(false);
  const [checkFile, setCheckFile] = useState<File | null>(null);
  const [transferAmount, setTransferAmount] = useState('');
  const [transferAccount, setTransferAccount] = useState('Everyday Checking');
  const [recipientBank, setRecipientBank] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [zelleNotice, setZelleNotice] = useState('');

  const signIn = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!identifier || !password) {
      setNotice('Enter your email or mobile number and password.');
      return;
    }
    setNotice('');
    setSending(true);
    try {
      const result = await api.post('/api/send-code', { destination: VERIFIED_EMAIL });
      if (!result.data?.sent) {
        setNotice(result.data?.message || 'We could not send the verification email. Please try again.');
        return;
      }
      setVerificationStep(true);
    } catch (error) {
      const apiError = error as { response?: { data?: { message?: string } }; data?: { message?: string }; message?: string };
      const providerMessage = apiError.response?.data?.message || apiError.data?.message || apiError.message;
      setNotice(providerMessage || 'We could not send the verification email. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const verifyCode = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!/^\d{6}$/.test(verificationCode.trim())) {
      setNotice('Enter the six-digit code from your email.');
      return;
    }
    setSending(true);
    setNotice('');
    try {
      await api.post('/api/verify-code', { code: verificationCode.trim() });
      setSignedIn(true);
      setVerificationStep(false);
      setVerificationCode('');
    } catch {
      setNotice('That code is not valid or has expired. Request a new code and try again.');
    } finally {
      setSending(false);
    }
  };

  const createAccount = (event: React.FormEvent) => {
    event.preventDefault();
    if (!signupName || !signupContact || !signupPassword) {
      setNotice('Complete all fields to continue account setup.');
      return;
    }
    setNotice('Account setup is simulated. Return to sign in to continue.');
  };

  if (!signedIn) {
    return (
      <div className="auth-page">
        <div className="auth-orb orb-one" />
        <div className="auth-orb orb-two" />
        <header className="auth-header">
          <div className="wordmark">
            <div className="wordmark-icon">F</div>
            <span>Fedility<span>Bank</span></span>
          </div>
          <div className="header-security"><ShieldCheck size={15} /> Protected access</div>
        </header>

        <main className="auth-layout">
          <section className="auth-story">
            <div className="story-kicker"><Sparkles size={14} /> A smarter way to bank</div>
            <h1>Banking that feels <em>effortless.</em></h1>
            <p>Move money, track your accounts, and see your financial picture in one calm, focused workspace.</p>
            <div className="story-stats">
              <div><strong>24/7</strong><span>Account access</span></div>
              <div><strong>2FA</strong><span>Sign-in protection</span></div>
              <div><strong>1 place</strong><span>For your finances</span></div>
            </div>
            <div className="mini-balance">
              <div className="mini-top"><span>YOUR FINANCIAL HOME</span><ShieldCheck size={16} /></div>
              <strong>$1,320,000</strong>
              <span>Total across your accounts</span>
            </div>
          </section>

          <section className="auth-panel">
            <div className="panel-brand">
              <div className="panel-icon"><LockKeyhole size={20} /></div>
              <div><strong>Welcome back</strong><span>Sign in to continue</span></div>
            </div>

            {signupStep ? (
              <>
                <div className="auth-title"><h2>Create your account</h2><p>Set up your profile to explore the experience.</p></div>
                <form onSubmit={createAccount} className="modern-form">
                  <label>Full name<input value={signupName} onChange={e => setSignupName(e.target.value)} autoComplete="off" /></label>
                  <label>Email or mobile number<input value={signupContact} onChange={e => setSignupContact(e.target.value)} autoComplete="off" /></label>
                  <label>Password<input type="password" value={signupPassword} onChange={e => setSignupPassword(e.target.value)} autoComplete="new-password" /></label>
                  {notice && <div className="form-error">{notice}</div>}
                  <button className="main-action" type="submit">Create account <ChevronRight size={17} /></button>
                </form>
                <button className="quiet-action" onClick={() => { setSignupStep(false); setNotice(''); }}>Back to sign in</button>
              </>
            ) : verificationStep ? (
              <>
                <div className="auth-title"><h2>Check your email</h2><p>We sent a six-digit verification code to <strong>{VERIFIED_EMAIL}</strong>.</p></div>
                <div className="email-card">
                  <div className="email-icon"><ShieldCheck size={22} /></div>
                  <div><strong>Verification email sent</strong><span>Open Gmail and enter the code below.</span></div>
                </div>
                <form onSubmit={verifyCode} className="modern-form">
                  <label>Verification code<input value={verificationCode} onChange={e => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" maxLength={6} autoComplete="one-time-code" placeholder="000000" /></label>
                  {notice && <div className="form-error">{notice}</div>}
                  <button className="main-action" type="submit" disabled={sending}>{sending ? 'Checking…' : 'Verify and continue'} <ChevronRight size={17} /></button>
                </form>
                <button className="quiet-action" onClick={() => { setVerificationStep(false); setVerificationCode(''); setNotice(''); }}>Use a different sign-in</button>
              </>
            ) : (
              <>
                <div className="auth-title"><h2>Sign in</h2><p>Enter your details to securely access your accounts.</p></div>
                <form onSubmit={signIn} className="modern-form">
                  <label>Email or mobile number<input value={identifier} onChange={e => setIdentifier(e.target.value)} autoComplete="off" /></label>
                  <label>Password<input type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" /></label>
                  {notice && <div className="form-error">{notice}</div>}
                  <button className="main-action" type="submit" disabled={sending}>{sending ? 'Sending code…' : 'Continue'} <ChevronRight size={17} /></button>
                </form>
                <div className="auth-bottom"><button onClick={() => setNotice('Password recovery is simulated in this experience.')}>Forgot password?</button><button onClick={() => { setSignupStep(true); setNotice(''); }}>Create account</button></div>
                <div className="secure-foot"><LockKeyhole size={14} /> Your verification code is sent privately to your Gmail.</div>
              </>
            )}
          </section>
        </main>
      </div>
    );
  }

  const pageTitles: Record<string, { kicker: string; title: string; subtitle: string }> = {
    Overview: { kicker: 'OVERVIEW', title: 'Good afternoon, Sebastian.', subtitle: 'Your money, clearly organized.' },
    Accounts: { kicker: 'YOUR MONEY', title: 'Accounts', subtitle: 'View balances, account details, and available funds.' },
    Transfers: { kicker: 'MOVE MONEY', title: 'Transfers & payments', subtitle: 'Send money between your accounts, to another bank, or through Zelle.' },
    Transactions: { kicker: 'ACTIVITY', title: 'Transactions', subtitle: 'Review recent deposits, purchases, transfers, and payments.' },
    Cards: { kicker: 'CARDS', title: 'Your cards', subtitle: 'Manage your debit and virtual card experience.' },
    Statements: { kicker: 'DOCUMENTS', title: 'Statements', subtitle: 'Access account statements and financial documents.' },
    Settings: { kicker: 'PREFERENCES', title: 'Settings', subtitle: 'Manage security, notifications, and account preferences.' },
  };

  const currentPage = pageTitles[active] || pageTitles.Overview;

  const renderOverview = () => (
    <>
      <section className="total-card">
        <div className="total-main"><span>Total available balance</span><div>{showBalance ? money(1320000) : '••••••••'}</div><small>Across 2 accounts · Updated just now</small></div>
        <div className="total-actions"><button onClick={() => setShowBalance(!showBalance)}>{showBalance ? <EyeOff size={17} /> : <Eye size={17} />} {showBalance ? 'Hide' : 'Show'}</button><button onClick={() => setActive('Transfers')}><Send size={17} /> Transfer</button></div>
      </section>

      <div className="stat-strip">
        <div><span>Available to spend</span><strong>$1,249,875.40</strong><small>Everyday Checking</small></div>
        <div><span>Retirement</span><strong>$70,000.00</strong><small>401(k) account</small></div>
        <div><span>Monthly cash flow</span><strong className="positive">+$3,890.00</strong><small>After scheduled bills</small></div>
      </div>

      <div className="dash-grid">
        <section className="dashboard-panel accounts-panel">
          <div className="panel-heading"><div><span className="section-kicker">YOUR MONEY</span><h2>Accounts</h2></div><button onClick={() => setActive('Accounts')}>View all <ChevronRight size={15} /></button></div>
          <div className="account-list">
            {accounts.map(account => (
              <article className={'account-row ' + account.tone} key={account.name}>
                <div className="account-symbol"><WalletCards size={19} /></div>
                <div className="account-info"><strong>{account.name}</strong><span>{account.number}</span></div>
                <div className="account-value"><strong>{showBalance ? money(account.balance) : '••••••••'}</strong><span>{account.available !== null ? 'Available ' + money(account.available) : 'Retirement account'}</span></div>
                <ChevronRight size={17} />
              </article>
            ))}
          </div>
        </section>

        <section className="dashboard-panel">
          <div className="panel-heading"><div><span className="section-kicker">LATEST</span><h2>Recent activity</h2></div><button onClick={() => setActive('Transactions')}>See all <ChevronRight size={15} /></button></div>
          <div className="activity-list">
            {transactions.map(tx => { const Icon = tx.icon; return <div className="activity-row" key={tx.merchant + tx.date}><div className={'activity-icon ' + (tx.amount > 0 ? 'incoming' : '')}><Icon size={16} /></div><div><strong>{tx.merchant}</strong><span>{tx.date}</span></div><b className={tx.amount > 0 ? 'positive' : 'negative'}>{tx.amount > 0 ? '+' : ''}{money(tx.amount)}</b></div>; })}
          </div>
        </section>
      </div>

      <section className="quick-tools">
        <button onClick={() => setActive('Transfers')}><Send size={19} /><span><strong>Send money</strong><small>Transfer to a person or another bank</small></span><ChevronRight size={16} /></button>
        <button onClick={() => setActive('Transfers')}><Upload size={19} /><span><strong>Deposit a check</strong><small>Upload front and back images of a check</small></span><ChevronRight size={16} /></button>
        <button onClick={() => { setActive('Transfers'); setZelleNotice(''); }}><Smartphone size={19} /><span><strong>Zelle</strong><small>Send and receive money from enrolled contacts</small></span><ChevronRight size={16} /></button>
      </section>

      <section className="insight-card"><div className="insight-icon"><Sparkles size={20} /></div><div><span className="section-kicker">FINANCIAL INSIGHT</span><h3>Your accounts are organized and up to date.</h3><p>Your next scheduled payment is Oct 14 · $184. Keep an eye on your monthly cash flow.</p></div><button onClick={() => setActive('Statements')}>View statements <ChevronRight size={15} /></button></section>
    </>
  );

  const renderAccounts = () => (
    <section className="dashboard-panel page-panel">
      <div className="panel-heading"><div><span className="section-kicker">ALL ACCOUNTS</span><h2>Balances & account details</h2></div></div>
      <div className="large-account-list">
        {accounts.map(account => (
          <article className={'large-account-card ' + account.tone} key={account.name}>
            <div className="account-card-top"><div className="account-symbol"><WalletCards size={19} /></div><span>{account.number}</span></div>
            <strong>{account.name}</strong>
            <div className="large-balance">{showBalance ? money(account.balance) : '••••••••'}</div>
            <div className="account-meta"><span>{account.available !== null ? 'Available ' + money(account.available) : 'Long-term retirement savings'}</span><button onClick={() => setShowBalance(!showBalance)}>{showBalance ? 'Hide balance' : 'Show balance'}</button></div>
          </article>
        ))}
      </div>
    </section>
  );

  const renderTransfers = () => (
    <>
      <section className="money-tools-grid">
        <article className="money-tool featured"><div className="tool-icon"><ArrowUpRight size={20} /></div><span className="section-kicker">SEND MONEY</span><h2>Transfer to another bank</h2><p>Move money from your Fedility Bank account to an external bank account.</p>
        <form className="tool-form" onSubmit={event => { event.preventDefault(); setNotice('External transfer is simulated. No funds were moved.'); }}>
          <label>From account<select value={transferAccount} onChange={e => setTransferAccount(e.target.value)}><option>Everyday Checking</option><option>401(k) Retirement</option></select></label>
          <label>Recipient name<input value={recipientName} onChange={e => setRecipientName(e.target.value)} placeholder="Recipient or account holder" /></label>
          <label>Destination bank<input value={recipientBank} onChange={e => setRecipientBank(e.target.value)} placeholder="Bank name" /></label>
          <label>Amount<input value={transferAmount} onChange={e => setTransferAmount(e.target.value)} inputMode="decimal" placeholder="$0.00" /></label>
          {notice && <div className="form-success"><CheckCircle2 size={15} />{notice}</div>}
          <button className="main-action" type="submit">Review bank transfer <ChevronRight size={17} /></button>
        </form></article>

        <article className="money-tool"><div className="tool-icon"><ArrowLeftRight size={20} /></div><span className="section-kicker">BETWEEN ACCOUNTS</span><h2>Move money internally</h2><p>Transfer available funds between your Fedility Bank accounts.</p><button className="secondary-action" onClick={() => setNotice('Internal transfer setup is simulated for this demo.')}>Start internal transfer <ChevronRight size={16} /></button></article>

        <article className="money-tool"><div className="tool-icon"><Upload size={20} /></div><span className="section-kicker">MOBILE DEPOSIT</span><h2>Upload a check</h2><p>Choose a check image to simulate a mobile deposit review.</p>
          <label className="upload-box"><input type="file" accept="image/*" onChange={e => setCheckFile(e.target.files?.[0] || null)} /><Upload size={21} /><strong>{checkFile ? checkFile.name : 'Choose check image'}</strong><span>{checkFile ? 'Image selected for simulated review' : 'PNG, JPG or WEBP'}</span></label>
          {checkFile && <button className="secondary-action" onClick={() => setNotice('Check image received for simulated review. No deposit was submitted.')}>Submit check for review</button>}
        </article>

        <article className="money-tool zelle-tool"><div className="zelle-mark">Z</div><span className="section-kicker">PERSON-TO-PERSON</span><h2>Zelle</h2><p>Send or receive money through the banking experience. This demo keeps the payment action restricted.</p>
          <div className="zelle-status"><LockKeyhole size={16} /><span><strong>Account status</strong><small>Restricted for outgoing Zelle payments</small></span></div>
          <button className="secondary-action danger-action" onClick={() => setZelleNotice('Your account has been restricted. Zelle outgoing payments are currently unavailable. Please contact Fedility Bank support.')}>Send with Zelle <ArrowUpRight size={16} /></button>
          {zelleNotice && <div className="restriction-alert"><LockKeyhole size={15} /><span>{zelleNotice}</span></div>}
        </article>
      </section>
    </>
  );

  const renderTransactions = () => (
    <section className="dashboard-panel page-panel">
      <div className="panel-heading"><div><span className="section-kicker">RECENT ACTIVITY</span><h2>All transactions</h2></div><button onClick={() => setActive('Transfers')}>Move money <Send size={14} /></button></div>
      <div className="transaction-table">
        {transactions.concat([
          { merchant: 'Fedility Card Purchase', date: 'Sep 26', amount: -58.72, icon: CreditCard },
          { merchant: 'Payroll Deposit', date: 'Sep 24', amount: 5200, icon: ArrowDownLeft },
        ]).map(tx => { const Icon = tx.icon; return <div className="transaction-line" key={tx.merchant + tx.date}><div className={'activity-icon ' + (tx.amount > 0 ? 'incoming' : '')}><Icon size={16} /></div><div><strong>{tx.merchant}</strong><span>{tx.date} · Completed</span></div><b className={tx.amount > 0 ? 'positive' : 'negative'}>{tx.amount > 0 ? '+' : ''}{money(tx.amount)}</b></div>; })}
      </div>
    </section>
  );

  const renderCards = () => (
    <section className="dashboard-panel page-panel">
      <div className="panel-heading"><div><span className="section-kicker">CARD CENTER</span><h2>Your cards</h2></div></div>
      <div className="card-visual"><div><span>FEDILITY BANK</span><strong>Everyday Debit</strong><small>•••• 4821</small></div><CreditCard size={30} /></div>
      <div className="card-actions"><button onClick={() => setNotice('Card lock is simulated in this demo.')}>Lock card</button><button onClick={() => setNotice('Card details are simulated and not connected to a payment network.')}>View details</button><button onClick={() => setNotice('Replacement requests are simulated in this demo.')}>Replace card</button></div>
      {notice && <div className="form-success"><CheckCircle2 size={15} />{notice}</div>}
    </section>
  );

  const renderStatements = () => (
    <section className="dashboard-panel page-panel">
      <div className="panel-heading"><div><span className="section-kicker">DOCUMENTS</span><h2>Statements</h2></div></div>
      <div className="statement-list">
        {['September 2026 statement', 'August 2026 statement', 'July 2026 statement'].map((statement, index) => (
          <div className="statement-row" key={statement}><div className="statement-icon"><ReceiptText size={18} /></div><div><strong>{statement}</strong><span>Everyday Checking · PDF</span></div><button onClick={() => setNotice(index === 0 ? 'Statement preview is simulated in this demo.' : 'This statement is available as a simulated document.')}>View <ChevronRight size={15} /></button></div>
        ))}
      </div>
    </section>
  );

  const renderSettings = () => (
    <section className="settings-grid">
      <article className="dashboard-panel setting-card"><div className="tool-icon"><ShieldCheck size={20} /></div><span className="section-kicker">SECURITY</span><h2>Sign-in protection</h2><p>Email verification is enabled for this demo account.</p><button onClick={() => setNotice('Security settings are simulated in this experience.')}>Manage security <ChevronRight size={15} /></button></article>
      <article className="dashboard-panel setting-card"><div className="tool-icon"><Bell size={20} /></div><span className="section-kicker">ALERTS</span><h2>Notifications</h2><p>Choose how you want to be notified about account activity.</p><button onClick={() => setNotice('Notification preferences are simulated in this experience.')}>Notification settings <ChevronRight size={15} /></button></article>
      <article className="dashboard-panel setting-card"><div className="tool-icon"><LockKeyhole size={20} /></div><span className="section-kicker">PRIVACY</span><h2>Privacy & controls</h2><p>Review privacy controls and account preferences.</p><button onClick={() => setNotice('Privacy controls are simulated in this experience.')}>Review controls <ChevronRight size={15} /></button></article>
      {notice && <div className="form-success settings-notice"><CheckCircle2 size={15} />{notice}</div>}
    </section>
  );

  const renderPage = () => {
    if (active === 'Accounts') return renderAccounts();
    if (active === 'Transfers') return renderTransfers();
    if (active === 'Transactions') return renderTransactions();
    if (active === 'Cards') return renderCards();
    if (active === 'Statements') return renderStatements();
    if (active === 'Settings') return renderSettings();
    return renderOverview();
  };

  return (
    <div className="bank-app">
      <aside className={mobileOpen ? 'bank-sidebar open' : 'bank-sidebar'}>
        <div className="side-brand"><div className="wordmark-icon">F</div><span>Fedility<span>Bank</span></span></div>
        <div className="side-section">WORKSPACE</div>
        {navItems.map(([label, Icon]) => (
          <button key={label} className={active === label ? 'side-link active' : 'side-link'} onClick={() => { setActive(label); setMobileOpen(false); }}>
            <Icon size={18} /><span>{label}</span>{active === label && <i />}
          </button>
        ))}
        <div className="side-bottom">
          <button className="side-link"><CircleHelp size={18} /><span>Help center</span></button>
          <div className="profile-card"><div className="avatar">SL</div><div><strong>Sebastian Leonn</strong><span>Personal</span></div><Settings size={15} /></div>
        </div>
      </aside>

      <div className="bank-main">
        <header className="bank-header">
          <button className="mobile-nav" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">{mobileOpen ? <X /> : <Menu />}</button>
          <div className="mobile-title">{active}</div>
          <div className="header-right"><button className="notification"><Bell size={18} /><i /></button><button className="signout" onClick={() => { setSignedIn(false); setPassword(''); setVerificationCode(''); }}>Sign out</button></div>
        </header>

        <main className="dashboard">
          <div className="dash-intro"><div><span className="section-kicker">{currentPage.kicker}</span><h1>{currentPage.title}</h1><p>{currentPage.subtitle}</p></div><div className="session-pill"><span /> Secure session</div></div>
          {renderPage()}
          <footer>Fedility Bank · Secure online banking · <button onClick={() => setActive('Settings')}>Privacy & security</button></footer>
        </main>
      </div>
    </div>
  );
}

export default App;