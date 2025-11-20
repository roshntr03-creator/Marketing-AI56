
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
    ArrowRightOnRectangleIcon, 
    TrashIcon, 
    CheckCircleIcon, 
    ExclamationTriangleIcon, 
    PlusIcon, 
    ArrowDownTrayIcon,
    EnvelopeIcon
} from '@heroicons/react/24/outline';

// --- Types ---

type SettingsTab = 'account' | 'billing' | 'team' | 'notifications';

interface TeamMember {
    id: string;
    name: string;
    email: string;
    role: 'Owner' | 'Admin' | 'Editor' | 'Viewer';
    status: 'Active' | 'Pending';
}

interface Invoice {
    id: string;
    date: string;
    amount: string;
    status: 'Paid' | 'Pending';
    plan: string;
}

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
            ? 'bg-zinc-800 text-white shadow-inner border border-white/5' 
            : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
        }`}
    >
        <div className={`p-2 rounded-lg ${active ? 'bg-indigo-500/20 text-indigo-400' : 'bg-zinc-900 text-zinc-500 group-hover:text-zinc-400'}`}>
            {icon}
        </div>
        <div>
            <span className="block text-sm font-semibold">{label}</span>
            {description && <span className={`text-[10px] block ${active ? 'text-zinc-400' : 'text-zinc-600'}`}>{description}</span>}
        </div>
    </button>
);

const SettingsPage: React.FC = () => {
    const { userProfile, logout, setLanguage, language } = useAppContext();
    const [activeTab, setActiveTab] = useState<SettingsTab>('account');
    
    // Local State for "Factual" representation
    // We initialize team with just the current user to be accurate to the session state
    const [team, setTeam] = useState<TeamMember[]>([
        { 
            id: 'current-user', 
            name: userProfile?.name || 'User', 
            email: userProfile?.email || 'user@example.com', 
            role: 'Owner', 
            status: 'Active' 
        }
    ]);
    
    const [inviteEmail, setInviteEmail] = useState('');
    
    // Notifications State
    const [notifMarketing, setNotifMarketing] = useState(false);
    const [notifSecurity, setNotifSecurity] = useState(true);
    const [notifUpdates, setNotifUpdates] = useState(true);

    // Handlers
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

    // --- Render Functions ---

    const renderAccountTab = () => (
        <div className="space-y-8 animate-fade-in">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-20 h-20 rounded-full bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center text-3xl font-bold text-zinc-400">
                    {userProfile?.name?.charAt(0) || 'U'}
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white">{userProfile?.name}</h2>
                    <p className="text-zinc-400">{userProfile?.email}</p>
                    <span className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-medium border border-indigo-500/20">
                        {userProfile?.plan || 'Free'} Plan
                    </span>
                </div>
            </div>

            <div className="grid gap-6">
                <Card className="p-6 bg-zinc-900/50 border-white/5">
                    <h3 className="text-lg font-medium text-white mb-4">Profile Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input label="Display Name" defaultValue={userProfile?.name} className="bg-zinc-950 border-white/10" />
                        <Input label="Email Address" defaultValue={userProfile?.email} disabled className="bg-zinc-950 border-white/10 opacity-60 cursor-not-allowed" />
                    </div>
                </Card>

                <Card className="p-6 bg-zinc-900/50 border-white/5">
                    <h3 className="text-lg font-medium text-white mb-4">Preferences</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Language</label>
                            <select 
                                value={language}
                                onChange={(e) => setLanguage(e.target.value as any)}
                                className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 text-sm"
                            >
                                <option value="en">English (United States)</option>
                                <option value="ar">Arabic (العربية)</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Timezone</label>
                            <div className="px-4 py-2.5 bg-zinc-950 border border-white/10 rounded-lg text-sm text-zinc-400">
                                {Intl.DateTimeFormat().resolvedOptions().timeZone} (Auto-detected)
                            </div>
                        </div>
                    </div>
                </Card>

                <Card className="p-6 bg-red-900/5 border-red-500/10">
                    <h3 className="text-lg font-medium text-red-400 mb-2">Danger Zone</h3>
                    <p className="text-sm text-red-300/60 mb-6">Permanently delete your account and all of your content.</p>
                    <div className="flex justify-end">
                        <Button variant="danger" size="sm" onClick={logout}>Delete Account</Button>
                    </div>
                </Card>
            </div>
        </div>
    );

    const renderBillingTab = () => (
        <div className="space-y-8 animate-fade-in">
            {/* Current Plan Status */}
            <Card className="p-8 bg-gradient-to-r from-indigo-900/20 to-zinc-900 border-white/10 relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider mb-2">Current Subscription</h3>
                            <div className="flex items-baseline gap-2">
                                <h2 className="text-4xl font-display font-bold text-white">{userProfile?.plan || 'Starter'}</h2>
                                <span className="text-zinc-400">/ month</span>
                            </div>
                        </div>
                        <div className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/20 flex items-center gap-2">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                            Active
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-white/10 pt-6">
                        <div>
                            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Next Billing Date</p>
                            <p className="text-white font-medium">November 1, 2024</p>
                        </div>
                        <div>
                            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Payment Method</p>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-5 bg-white rounded flex items-center justify-center px-1">
                                    <div className="w-2 h-2 bg-red-500 rounded-full opacity-80 -mr-0.5"></div>
                                    <div className="w-2 h-2 bg-orange-500 rounded-full opacity-80"></div>
                                </div>
                                <p className="text-white font-medium">•••• 4242</p>
                            </div>
                        </div>
                        <div>
                            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Total Spent</p>
                            <p className="text-white font-medium">$298.00</p>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Plan Options */}
            <div>
                <h3 className="text-lg font-bold text-white mb-4">Available Plans</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {PRICING_PLANS.map((plan) => {
                        const isCurrent = userProfile?.plan === plan.name;
                        return (
                            <div key={plan.name} className={`p-6 rounded-xl border flex flex-col transition-all duration-300 ${isCurrent ? 'bg-zinc-900 border-indigo-500 ring-1 ring-indigo-500/20' : 'bg-zinc-900/30 border-white/5 hover:border-white/10'}`}>
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h4 className="font-bold text-white text-lg">{plan.name}</h4>
                                        <p className="text-xs text-zinc-500 mt-1">{plan.description}</p>
                                    </div>
                                    {isCurrent && <CheckCircleIcon className="w-6 h-6 text-indigo-500" />}
                                </div>
                                <div className="mb-6">
                                    <span className="text-3xl font-bold text-white">{plan.price}</span>
                                    <span className="text-xs text-zinc-500">{plan.frequency}</span>
                                </div>
                                <ul className="space-y-3 mb-8 flex-1">
                                    {plan.features.map((feat, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm text-zinc-400">
                                            <CheckCircleIcon className="w-4 h-4 text-zinc-600 mt-0.5 flex-shrink-0" />
                                            {feat}
                                        </li>
                                    ))}
                                </ul>
                                <Button 
                                    variant={isCurrent ? 'outline' : 'primary'} 
                                    disabled={isCurrent}
                                    className="w-full justify-center"
                                >
                                    {isCurrent ? 'Current Plan' : 'Upgrade'}
                                </Button>
                            </div>
                        );
                    })}
                </div>
            </div>

             {/* Invoice History (Static for Demo but realistic structure) */}
             <Card className="p-0 bg-zinc-900/50 border-white/5 overflow-hidden">
                <div className="p-6 border-b border-white/5">
                    <h3 className="font-bold text-white">Billing History</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-zinc-400">
                        <thead className="bg-zinc-950/50 text-xs uppercase font-medium text-zinc-500">
                            <tr>
                                <th className="px-6 py-3">Invoice</th>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Amount</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-right">Download</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <tr className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 font-mono text-zinc-300">INV-2024-001</td>
                                <td className="px-6 py-4">Oct 1, 2024</td>
                                <td className="px-6 py-4 text-white">$99.00</td>
                                <td className="px-6 py-4"><span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] border border-emerald-500/20 font-bold">Paid</span></td>
                                <td className="px-6 py-4 text-right"><button className="hover:text-white"><ArrowDownTrayIcon className="w-4 h-4" /></button></td>
                            </tr>
                             <tr className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 font-mono text-zinc-300">INV-2024-002</td>
                                <td className="px-6 py-4">Sep 1, 2024</td>
                                <td className="px-6 py-4 text-white">$99.00</td>
                                <td className="px-6 py-4"><span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] border border-emerald-500/20 font-bold">Paid</span></td>
                                <td className="px-6 py-4 text-right"><button className="hover:text-white"><ArrowDownTrayIcon className="w-4 h-4" /></button></td>
                            </tr>
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
                    <h2 className="text-xl font-bold text-white">Team Management</h2>
                    <p className="text-sm text-zinc-400">Collaborate with your organization.</p>
                </div>
            </div>

            {/* Invite Bar */}
            <Card className="p-4 bg-zinc-900/50 border-white/5">
                <form onSubmit={handleInvite} className="flex gap-4 items-end">
                    <div className="flex-1">
                         <Input 
                            label="Email Address" 
                            placeholder="colleague@company.com" 
                            value={inviteEmail}
                            onChange={e => setInviteEmail(e.target.value)}
                            className="bg-zinc-950 border-white/10"
                        />
                    </div>
                    <div className="w-32">
                        <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase tracking-wider">Role</label>
                        <div className="h-[42px] px-3 bg-zinc-950 border border-white/10 rounded-lg flex items-center text-sm text-zinc-400 cursor-not-allowed">
                            Viewer
                        </div>
                    </div>
                    <Button type="submit" disabled={!inviteEmail} leftIcon={<EnvelopeIcon className="w-4 h-4"/>}>
                        Invite
                    </Button>
                </form>
            </Card>

            {/* Member List */}
            <Card className="p-0 bg-zinc-900/50 border-white/5 overflow-hidden">
                <div className="divide-y divide-white/5">
                    {team.map(member => (
                        <div key={member.id} className="flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-bold text-zinc-400 border border-white/5">
                                    {member.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-white">{member.name} {member.id === 'current-user' && <span className="text-zinc-500 font-normal">(You)</span>}</h4>
                                    <p className="text-xs text-zinc-500">{member.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                 <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${member.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                                     {member.status}
                                 </span>
                                 <span className="text-sm text-zinc-300 font-medium w-16 text-right">
                                     {member.role}
                                 </span>
                                 <div className="w-8">
                                     {member.role !== 'Owner' && (
                                        <button 
                                            className="text-zinc-600 hover:text-red-400 transition-colors p-2" 
                                            title="Remove Member"
                                            onClick={() => setTeam(team.filter(t => t.id !== member.id))}
                                        >
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                     )}
                                 </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );

    const renderNotificationsTab = () => (
        <div className="space-y-6 animate-fade-in">
             <div className="mb-6">
                <h2 className="text-xl font-bold text-white">Notification Settings</h2>
                <p className="text-sm text-zinc-400">Manage your email preferences.</p>
            </div>
            
            <Card className="divide-y divide-white/5 bg-zinc-900/50 border-white/5">
                <div className="p-6 flex items-center justify-between">
                    <div className="flex gap-4">
                        <div className="p-2.5 bg-zinc-800 rounded-xl text-zinc-400 h-fit">
                            <BellIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-base font-bold text-white">Product Updates</p>
                            <p className="text-sm text-zinc-500">Receive news about new features and improvements.</p>
                        </div>
                    </div>
                    <Toggle id="n1" label="" enabled={notifUpdates} onChange={setNotifUpdates} />
                </div>
                <div className="p-6 flex items-center justify-between">
                    <div className="flex gap-4">
                        <div className="p-2.5 bg-zinc-800 rounded-xl text-zinc-400 h-fit">
                            <CheckCircleIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-base font-bold text-white">Marketing Tips</p>
                            <p className="text-sm text-zinc-500">Weekly AI strategies and prompts to improve your workflow.</p>
                        </div>
                    </div>
                    <Toggle id="n2" label="" enabled={notifMarketing} onChange={setNotifMarketing} />
                </div>
                 <div className="p-6 flex items-center justify-between">
                    <div className="flex gap-4">
                        <div className="p-2.5 bg-zinc-800 rounded-xl text-zinc-400 h-fit">
                            <ExclamationTriangleIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-base font-bold text-white">Security Alerts</p>
                            <p className="text-sm text-zinc-500">Critical alerts about your account security (Always on).</p>
                        </div>
                    </div>
                    <Toggle id="n3" label="" enabled={notifSecurity} onChange={setNotifSecurity} />
                </div>
            </Card>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto pb-20 h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-8 animate-fade-in">
            
            {/* Sidebar Navigation */}
            <div className="w-full lg:w-64 flex-shrink-0 space-y-2">
                <h3 className="px-3 text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">Settings</h3>
                <TabButton 
                    active={activeTab === 'account'} 
                    onClick={() => setActiveTab('account')} 
                    icon={<UserCircleIcon className="w-5 h-5"/>} 
                    label="General" 
                    description="Profile & preferences"
                />
                <TabButton 
                    active={activeTab === 'billing'} 
                    onClick={() => setActiveTab('billing')} 
                    icon={<CreditCardIcon className="w-5 h-5"/>} 
                    label="Billing" 
                    description="Plan & history"
                />
                <TabButton 
                    active={activeTab === 'team'} 
                    onClick={() => setActiveTab('team')} 
                    icon={<UsersIcon className="w-5 h-5"/>} 
                    label="Team" 
                    description="Members & roles"
                />
                <TabButton 
                    active={activeTab === 'notifications'} 
                    onClick={() => setActiveTab('notifications')} 
                    icon={<BellIcon className="w-5 h-5"/>} 
                    label="Notifications" 
                    description="Email settings"
                />
                
                <div className="pt-8 px-3">
                     <button 
                        onClick={logout}
                        className="flex items-center gap-3 text-sm font-medium text-zinc-500 hover:text-white transition-colors w-full p-2 rounded-lg hover:bg-white/5"
                     >
                         <ArrowRightOnRectangleIcon className="w-5 h-5" />
                         Sign Out
                     </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 rounded-2xl lg:overflow-y-auto custom-scrollbar relative">
                 <div className="relative z-10">
                    {activeTab === 'account' && renderAccountTab()}
                    {activeTab === 'billing' && renderBillingTab()}
                    {activeTab === 'team' && renderTeamTab()}
                    {activeTab === 'notifications' && renderNotificationsTab()}
                 </div>
            </div>
        </div>
    );
};

export default SettingsPage;
