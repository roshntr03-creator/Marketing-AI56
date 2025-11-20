
import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import Toggle from '../components/ui/Toggle';
import { PRICING_PLANS } from '../constants';
import { 
    UserCircleIcon, 
    CreditCardIcon, 
    UsersIcon, 
    BellIcon, 
    CommandLineIcon, 
    KeyIcon, 
    ArrowRightOnRectangleIcon, 
    TrashIcon, 
    CheckCircleIcon, 
    ExclamationTriangleIcon, 
    PlusIcon, 
    DocumentDuplicateIcon,
    ArrowDownTrayIcon,
    CheckIcon,
    ClockIcon
} from '@heroicons/react/24/outline';

// --- Types & Mock Data ---

type SettingsTab = 'account' | 'billing' | 'team' | 'notifications' | 'api';

interface TeamMember {
    id: string;
    name: string;
    email: string;
    role: 'Admin' | 'Editor' | 'Viewer';
    status: 'Active' | 'Pending';
    avatar?: string;
}

interface Invoice {
    id: string;
    date: string;
    amount: string;
    status: 'Paid' | 'Pending';
    plan: string;
}

interface ApiKey {
    id: string;
    name: string;
    prefix: string;
    created: string;
    lastUsed: string;
}

const MOCK_TEAM: TeamMember[] = [
    { id: '1', name: 'Alex Creator', email: 'alex@company.com', role: 'Admin', status: 'Active' },
    { id: '2', name: 'Sarah Designer', email: 'sarah@company.com', role: 'Editor', status: 'Active' },
    { id: '3', name: 'Mike Marketing', email: 'mike@company.com', role: 'Viewer', status: 'Pending' },
];

const MOCK_INVOICES: Invoice[] = [
    { id: 'INV-2024-001', date: 'Oct 1, 2024', amount: '$99.00', status: 'Paid', plan: 'Pro Plan' },
    { id: 'INV-2024-002', date: 'Sep 1, 2024', amount: '$99.00', status: 'Paid', plan: 'Pro Plan' },
    { id: 'INV-2024-003', date: 'Aug 1, 2024', amount: '$29.00', status: 'Paid', plan: 'Starter Plan' },
];

const MOCK_KEYS: ApiKey[] = [
    { id: 'key_1', name: 'Production App', prefix: 'pk_live_...', created: '2024-01-15', lastUsed: '2 mins ago' },
];

// --- Sub-Components ---

const TabButton: React.FC<{ 
    active: boolean; 
    onClick: () => void; 
    icon: React.ReactNode; 
    label: string; 
    description?: string 
}> = ({ active, onClick, icon, label, description }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 text-left group ${
            active 
            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
            : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
        }`}
    >
        <div className={`p-2 rounded-lg ${active ? 'bg-white/20 text-white' : 'bg-zinc-800 text-zinc-500 group-hover:text-zinc-300'}`}>
            {icon}
        </div>
        <div>
            <span className="block text-sm font-semibold">{label}</span>
            {description && <span className={`text-[10px] block ${active ? 'text-indigo-200' : 'text-zinc-500'}`}>{description}</span>}
        </div>
    </button>
);

const SettingsPage: React.FC = () => {
    const { userProfile, logout, setLanguage, language } = useAppContext();
    const [activeTab, setActiveTab] = useState<SettingsTab>('account');
    
    // State for interactions
    const [team, setTeam] = useState(MOCK_TEAM);
    const [apiKeys, setApiKeys] = useState(MOCK_KEYS);
    const [inviteEmail, setInviteEmail] = useState('');
    const [copiedKey, setCopiedKey] = useState<string | null>(null);
    
    // Notifications State
    const [notifMarketing, setNotifMarketing] = useState(false);
    const [notifSecurity, setNotifSecurity] = useState(true);
    const [notifUpdates, setNotifUpdates] = useState(true);

    // --- Handlers ---
    const handleInvite = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inviteEmail) return;
        const newMember: TeamMember = {
            id: Date.now().toString(),
            name: inviteEmail.split('@')[0],
            email: inviteEmail,
            role: 'Viewer',
            status: 'Pending'
        };
        setTeam([...team, newMember]);
        setInviteEmail('');
    };

    const handleDeleteKey = (id: string) => {
        setApiKeys(apiKeys.filter(k => k.id !== id));
    };

    const handleCreateKey = () => {
        const newKey: ApiKey = {
            id: `key_${Date.now()}`,
            name: 'New Key',
            prefix: 'pk_live_...',
            created: new Date().toISOString().split('T')[0],
            lastUsed: 'Never'
        };
        setApiKeys([...apiKeys, newKey]);
    };

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedKey(id);
        setTimeout(() => setCopiedKey(null), 2000);
    };

    // --- Render Functions for Tabs ---

    const renderAccountTab = () => (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-xl font-bold text-white">Personal Profile</h2>
                    <p className="text-sm text-zinc-400">Manage your personal information and login credentials.</p>
                </div>
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white shadow-xl border-2 border-zinc-900">
                    {userProfile?.name.charAt(0)}
                </div>
            </div>

            <Card className="p-6 bg-zinc-900 border-white/10 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input label="Full Name" defaultValue={userProfile?.name} className="bg-zinc-950 border-white/10" />
                    <Input label="Email Address" defaultValue={userProfile?.email} disabled className="bg-zinc-950 border-white/10 opacity-60" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Language</label>
                        <select 
                            value={language}
                            onChange={(e) => setLanguage(e.target.value as any)}
                            className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 text-sm"
                        >
                            <option value="en">English (US)</option>
                            <option value="ar">Arabic (العربية)</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Timezone</label>
                        <select className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 text-sm">
                            <option>UTC (Coordinated Universal Time)</option>
                            <option>EST (Eastern Standard Time)</option>
                            <option>PST (Pacific Standard Time)</option>
                        </select>
                    </div>
                </div>
                <div className="flex justify-end pt-4">
                    <Button>Save Changes</Button>
                </div>
            </Card>

            <Card className="p-6 bg-zinc-900 border-white/10 border-l-4 border-l-red-500">
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-white font-bold">Danger Zone</h3>
                        <p className="text-sm text-zinc-400 mt-1">Irreversible actions. Proceed with caution.</p>
                    </div>
                </div>
                <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-zinc-200">Delete Account</p>
                        <p className="text-xs text-zinc-500">Permanently remove your account and all data.</p>
                    </div>
                    <Button variant="danger" size="sm" onClick={logout}>Delete Account</Button>
                </div>
            </Card>
        </div>
    );

    const renderBillingTab = () => (
        <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Usage Card */}
                <Card className="lg:col-span-2 p-6 bg-gradient-to-br from-indigo-900/20 to-zinc-900 border-indigo-500/30 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full"></div>
                    <div className="relative z-10 flex justify-between items-start">
                        <div>
                            <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider mb-1">Current Plan</h3>
                            <h2 className="text-3xl font-display font-bold text-white mb-4">{userProfile?.plan || 'Pro'} Plan</h2>
                            <div className="flex items-center gap-2 text-sm text-zinc-300">
                                <CheckCircleIcon className="w-4 h-4 text-emerald-400" />
                                <span>Renews on Nov 1, 2024</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <div className="text-right mb-2">
                                <span className="text-2xl font-bold text-white">450</span>
                                <span className="text-zinc-500 text-sm"> / 1000 Credits</span>
                            </div>
                            <div className="w-32 h-2 bg-zinc-800 rounded-full overflow-hidden">
                                <div className="h-full w-[45%] bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Payment Method */}
                <Card className="p-6 bg-zinc-900 border-white/10 flex flex-col justify-between">
                    <div>
                        <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-4">Payment Method</h3>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-6 bg-white rounded flex items-center justify-center">
                                <div className="w-3 h-3 rounded-full bg-red-500 -mr-1 opacity-80"></div>
                                <div className="w-3 h-3 rounded-full bg-orange-500 opacity-80"></div>
                            </div>
                            <span className="text-white font-mono text-sm">•••• 4242</span>
                        </div>
                        <p className="text-xs text-zinc-500">Expires 12/25</p>
                    </div>
                    <Button variant="outline" size="sm" className="mt-4">Update Card</Button>
                </Card>
            </div>

            {/* Plans Grid */}
            <div>
                <h3 className="text-lg font-bold text-white mb-4">Available Plans</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {PRICING_PLANS.map((plan) => {
                        const isCurrent = userProfile?.plan === plan.name;
                        return (
                            <div key={plan.name} className={`p-5 rounded-xl border flex flex-col ${isCurrent ? 'bg-indigo-900/10 border-indigo-500/50' : 'bg-zinc-900 border-white/5'}`}>
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h4 className="font-bold text-white">{plan.name}</h4>
                                        <p className="text-xs text-zinc-500 mt-1">{plan.description}</p>
                                    </div>
                                    {isCurrent && <span className="px-2 py-1 bg-indigo-500/20 text-indigo-300 text-[10px] font-bold rounded uppercase">Current</span>}
                                </div>
                                <div className="mb-6">
                                    <span className="text-2xl font-bold text-white">{plan.price}</span>
                                    <span className="text-xs text-zinc-500">{plan.frequency}</span>
                                </div>
                                <Button 
                                    variant={isCurrent ? 'secondary' : 'primary'} 
                                    disabled={isCurrent}
                                    className="w-full justify-center mt-auto"
                                >
                                    {isCurrent ? 'Active Plan' : plan.name === 'Enterprise' ? 'Contact Sales' : 'Upgrade'}
                                </Button>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Invoice History */}
            <Card className="p-0 bg-zinc-900 border-white/10 overflow-hidden">
                <div className="p-6 border-b border-white/5">
                    <h3 className="font-bold text-white">Billing History</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-zinc-400">
                        <thead className="bg-zinc-950/50 text-xs uppercase font-medium text-zinc-500">
                            <tr>
                                <th className="px-6 py-3">Invoice ID</th>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Plan</th>
                                <th className="px-6 py-3">Amount</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-right">Download</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {MOCK_INVOICES.map((inv) => (
                                <tr key={inv.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 font-mono text-white">{inv.id}</td>
                                    <td className="px-6 py-4">{inv.date}</td>
                                    <td className="px-6 py-4">{inv.plan}</td>
                                    <td className="px-6 py-4 text-white">{inv.amount}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                                            {inv.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-zinc-500 hover:text-white transition-colors">
                                            <ArrowDownTrayIcon className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );

    const renderTeamTab = () => (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-white">Team Members</h2>
                    <p className="text-sm text-zinc-400">Manage access and roles for your workspace.</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-900/20 border border-indigo-500/30 rounded-lg text-indigo-300 text-xs font-medium">
                    <UsersIcon className="w-4 h-4" />
                    <span>{team.length} / 5 Seats Used</span>
                </div>
            </div>

            {/* Invite Bar */}
            <Card className="p-4 bg-zinc-900 border-white/10">
                <form onSubmit={handleInvite} className="flex gap-4 items-end">
                    <div className="flex-1">
                         <Input 
                            label="Invite by Email" 
                            placeholder="colleague@company.com" 
                            value={inviteEmail}
                            onChange={e => setInviteEmail(e.target.value)}
                            className="bg-zinc-950 border-white/10"
                        />
                    </div>
                    <div className="w-40">
                        <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase tracking-wider">Role</label>
                        <select className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 text-sm">
                            <option>Editor</option>
                            <option>Viewer</option>
                            <option>Admin</option>
                        </select>
                    </div>
                    <Button type="submit" disabled={!inviteEmail} leftIcon={<PlusIcon className="w-4 h-4"/>}>
                        Invite
                    </Button>
                </form>
            </Card>

            {/* Member List */}
            <div className="space-y-3">
                {team.map(member => (
                    <div key={member.id} className="flex items-center justify-between p-4 bg-zinc-900 border border-white/5 rounded-xl group hover:border-white/10 transition-all">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-bold text-zinc-400 border border-white/5">
                                {member.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-white">{member.name}</h4>
                                <p className="text-xs text-zinc-500">{member.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                             <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${member.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                                 {member.status}
                             </span>
                             <select 
                                defaultValue={member.role}
                                className="bg-transparent text-sm text-zinc-300 font-medium focus:text-white outline-none cursor-pointer"
                             >
                                 <option>Admin</option>
                                 <option>Editor</option>
                                 <option>Viewer</option>
                             </select>
                             <button 
                                className="text-zinc-600 hover:text-red-400 transition-colors p-2" 
                                title="Remove Member"
                                onClick={() => setTeam(team.filter(t => t.id !== member.id))}
                            >
                                 <TrashIcon className="w-4 h-4" />
                             </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderApiTab = () => (
        <div className="space-y-6 animate-fade-in">
             <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-xl font-bold text-white">API & Integrations</h2>
                    <p className="text-sm text-zinc-400">Manage API keys and external connections.</p>
                </div>
                <Button onClick={handleCreateKey} leftIcon={<PlusIcon className="w-4 h-4"/>}>Create New Key</Button>
            </div>

            <Card className="p-0 bg-zinc-900 border-white/10 overflow-hidden">
                <div className="p-6 border-b border-white/5 bg-white/5 flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                        <KeyIcon className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-sm">Active API Keys</h3>
                        <p className="text-xs text-zinc-400">Do not share these keys with anyone.</p>
                    </div>
                </div>
                <div className="divide-y divide-white/5">
                    {apiKeys.map(key => (
                        <div key={key.id} className="p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                            <div>
                                <h4 className="text-sm font-bold text-white mb-1">{key.name}</h4>
                                <div className="flex items-center gap-3">
                                    <code className="bg-black px-2 py-1 rounded text-xs font-mono text-zinc-400 border border-white/10">
                                        {key.prefix}************************
                                    </code>
                                    <span className="text-[10px] text-zinc-600">Created: {key.created}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Button 
                                    size="sm" 
                                    variant="secondary" 
                                    onClick={() => copyToClipboard(key.prefix + 'xyz123', key.id)}
                                    className={copiedKey === key.id ? 'text-emerald-400 border-emerald-500/30' : ''}
                                >
                                    {copiedKey === key.id ? <CheckIcon className="w-4 h-4" /> : <DocumentDuplicateIcon className="w-4 h-4" />}
                                </Button>
                                <Button size="sm" variant="danger" onClick={() => handleDeleteKey(key.id)}>Revoke</Button>
                            </div>
                        </div>
                    ))}
                    {apiKeys.length === 0 && (
                        <div className="p-8 text-center text-zinc-500 text-sm">No active API keys.</div>
                    )}
                </div>
            </Card>

            <Card className="p-6 bg-zinc-900 border-white/10">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
                        <CommandLineIcon className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-sm">Webhooks</h3>
                        <p className="text-xs text-zinc-400">Receive real-time updates for generation events.</p>
                    </div>
                </div>
                <div className="grid gap-4">
                     <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5">
                         <div className="flex items-center gap-3">
                             <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                             <span className="text-sm text-zinc-300 font-mono">https://api.yourdomain.com/webhooks/marketing-ai</span>
                         </div>
                         <Button size="sm" variant="outline">Configure</Button>
                     </div>
                     <Button variant="secondary" className="w-full border-dashed border-white/10 hover:border-white/20">
                         <PlusIcon className="w-4 h-4 mr-2" /> Add Endpoint
                     </Button>
                </div>
            </Card>
        </div>
    );

    const renderNotificationsTab = () => (
        <div className="space-y-6 animate-fade-in">
             <div>
                <h2 className="text-xl font-bold text-white">Notifications</h2>
                <p className="text-sm text-zinc-400">Choose what you want to be notified about.</p>
            </div>
            
            <Card className="divide-y divide-white/5 bg-zinc-900 border-white/10">
                <div className="p-4 flex items-center justify-between">
                    <div className="flex gap-4">
                        <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400 h-fit">
                            <BellIcon className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white">Product Updates</p>
                            <p className="text-xs text-zinc-500">News about new features and improvements.</p>
                        </div>
                    </div>
                    <Toggle id="n1" label="" enabled={notifUpdates} onChange={setNotifUpdates} />
                </div>
                <div className="p-4 flex items-center justify-between">
                    <div className="flex gap-4">
                        <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 h-fit">
                            <CheckCircleIcon className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white">Marketing Tips</p>
                            <p className="text-xs text-zinc-500">Weekly AI strategies and prompts.</p>
                        </div>
                    </div>
                    <Toggle id="n2" label="" enabled={notifMarketing} onChange={setNotifMarketing} />
                </div>
                 <div className="p-4 flex items-center justify-between">
                    <div className="flex gap-4">
                        <div className="p-2 bg-red-500/10 rounded-lg text-red-400 h-fit">
                            <ExclamationTriangleIcon className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white">Security Alerts</p>
                            <p className="text-xs text-zinc-500">Critical alerts about your account security.</p>
                        </div>
                    </div>
                    <Toggle id="n3" label="" enabled={notifSecurity} onChange={setNotifSecurity} />
                </div>
            </Card>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto pb-20 h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-8 animate-fade-in">
            
            {/* Sidebar Navigation */}
            <div className="w-full lg:w-64 flex-shrink-0 space-y-2">
                <h3 className="px-3 text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">Settings</h3>
                <TabButton 
                    active={activeTab === 'account'} 
                    onClick={() => setActiveTab('account')} 
                    icon={<UserCircleIcon className="w-5 h-5"/>} 
                    label="My Account" 
                />
                <TabButton 
                    active={activeTab === 'billing'} 
                    onClick={() => setActiveTab('billing')} 
                    icon={<CreditCardIcon className="w-5 h-5"/>} 
                    label="Billing & Plans" 
                />
                <TabButton 
                    active={activeTab === 'team'} 
                    onClick={() => setActiveTab('team')} 
                    icon={<UsersIcon className="w-5 h-5"/>} 
                    label="Team Members" 
                />
                <TabButton 
                    active={activeTab === 'notifications'} 
                    onClick={() => setActiveTab('notifications')} 
                    icon={<BellIcon className="w-5 h-5"/>} 
                    label="Notifications" 
                />
                <TabButton 
                    active={activeTab === 'api'} 
                    onClick={() => setActiveTab('api')} 
                    icon={<CommandLineIcon className="w-5 h-5"/>} 
                    label="API & Integrations" 
                />
                
                <div className="pt-8 px-3">
                     <button 
                        onClick={logout}
                        className="flex items-center gap-3 text-sm font-medium text-zinc-500 hover:text-red-400 transition-colors"
                     >
                         <ArrowRightOnRectangleIcon className="w-5 h-5" />
                         Sign Out
                     </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 bg-[#09090b] border border-white/5 rounded-2xl p-8 lg:overflow-y-auto custom-scrollbar shadow-2xl relative">
                 <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
                 <div className="relative z-10">
                    {activeTab === 'account' && renderAccountTab()}
                    {activeTab === 'billing' && renderBillingTab()}
                    {activeTab === 'team' && renderTeamTab()}
                    {activeTab === 'notifications' && renderNotificationsTab()}
                    {activeTab === 'api' && renderApiTab()}
                 </div>
            </div>
        </div>
    );
};

export default SettingsPage;
