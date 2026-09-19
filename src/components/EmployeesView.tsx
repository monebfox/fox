import React, { useState } from 'react';
import { Language, TabType, User } from '../types';
import { getTranslation } from '../i18n/translations';
import { 
  ShieldCheck, 
  UserPlus, 
  Trash2, 
  Edit3, 
  Key, 
  Check, 
  Eye, 
  EyeOff, 
  X,
  UserCheck,
  RotateCcw,
  AlertTriangle
} from 'lucide-react';

interface EmployeesViewProps {
  lang: Language;
  users: User[];
  currentUser: User | null;
  onAddUser: (user: User) => void;
  onUpdateUser?: (user: User) => void;
  onDeleteUser: (id: string) => void;
  onUpdatePassword?: (userId: string, newPass: string) => void;
}

export const EmployeesView: React.FC<EmployeesViewProps> = ({
  lang,
  users,
  currentUser,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
  onUpdatePassword
}) => {
  const [name, setName] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showFormPassword, setShowFormPassword] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Strictly guard against non-admin access
  if (currentUser?.role !== 'admin') {
    return (
      <div className="bg-[#FFFDF8] border border-rose-200 rounded-2xl p-8 shadow-sm text-center max-w-lg mx-auto my-12 space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-[#0B1E3F]">
          {getTranslation(lang, 'accessDeniedTitle')}
        </h2>
        <p className="text-sm font-medium text-[#5B6B74]">
          {getTranslation(lang, 'accessDeniedMsg')}
        </p>
      </div>
    );
  }

  // Available permissions matching navbar tabs (Staff permissions)
  const assignableTabs: { id: TabType; label: string }[] = [
    { id: 'invoice', label: getTranslation(lang, 'tabInvoice') },
    { id: 'invoices', label: getTranslation(lang, 'tabInvoices') },
    { id: 'clients', label: getTranslation(lang, 'tabClients') },
    { id: 'prices', label: getTranslation(lang, 'tabPrices') },
    { id: 'visas', label: getTranslation(lang, 'tabVisas') }
  ];

  const [selectedPermissions, setSelectedPermissions] = useState<TabType[]>([
    'invoice', 'invoices', 'clients', 'prices'
  ]);

  // Quick Password modal
  const [passwordModalUser, setPasswordModalUser] = useState<User | null>(null);
  const [newPasswordVal, setNewPasswordVal] = useState<string>('');
  const [showPasswordVal, setShowPasswordVal] = useState<boolean>(false);

  // Delete Confirmation modal
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const handleTogglePerm = (tabId: TabType) => {
    setSelectedPermissions(prev =>
      prev.includes(tabId) ? prev.filter(t => t !== tabId) : [...prev, tabId]
    );
  };

  const handleStartEdit = (user: User) => {
    setEditingId(user.id);
    setName(user.name);
    setUsername(user.username);
    setPassword(user.password);
    setIsAdmin(user.role === 'admin');
    setSelectedPermissions(
      user.permissions.filter(p => p !== 'dashboard' && p !== 'ticket')
    );
    // Scroll smoothly to form
    const formEl = document.getElementById('employee-form-card');
    if (formEl) formEl.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setName('');
    setUsername('');
    setPassword('');
    setIsAdmin(false);
    setSelectedPermissions(['invoice', 'invoices', 'clients', 'prices']);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !username.trim() || !password.trim()) return;

    const finalPermissions: TabType[] = isAdmin
      ? ['dashboard', 'invoice', 'invoices', 'ticket', 'clients', 'prices', 'reports', 'employees', 'visas']
      : ['dashboard', ...selectedPermissions, 'ticket'];

    if (editingId) {
      const updatedUser: User = {
        id: editingId,
        name: name.trim(),
        username: username.trim().toLowerCase(),
        password: password.trim(),
        role: isAdmin ? 'admin' : 'staff',
        permissions: finalPermissions
      };
      if (onUpdateUser) {
        onUpdateUser(updatedUser);
      } else {
        onAddUser(updatedUser);
      }
      handleCancelEdit();
    } else {
      const newUser: User = {
        id: `usr-${Date.now()}`,
        name: name.trim(),
        username: username.trim().toLowerCase(),
        password: password.trim(),
        role: isAdmin ? 'admin' : 'staff',
        permissions: finalPermissions
      };
      onAddUser(newUser);
      setName('');
      setUsername('');
      setPassword('');
      setIsAdmin(false);
      setSelectedPermissions(['invoice', 'invoices', 'clients', 'prices']);
    }
  };

  const getPermissionLabels = (user: User): string => {
    if (user.role === 'admin') {
      return lang === 'ar' ? 'كل الصلاحيات' : lang === 'fr' ? 'Tous les droits' : 'All permissions';
    }
    const labels = user.permissions
      .filter(p => p !== 'dashboard' && p !== 'ticket')
      .map(p => {
        const found = assignableTabs.find(t => t.id === p);
        return found ? found.label : p;
      });
    return labels.join(' ، ');
  };

  return (
    <div className="space-y-6">
      {/* Main Container */}
      <div className="bg-[#FFFDF8] border border-[#DFD5BE] rounded-2xl p-4 sm:p-6 shadow-sm space-y-6">
        
        {/* Title Header - Matching Bourwe Screenshot */}
        <div className="flex items-center gap-3 pb-3 border-b border-[#DFD5BE]">
          <span className="text-xl sm:text-2xl font-black text-[#C99A3E]">|</span>
          <h2 className="text-lg sm:text-xl font-black text-[#0B1E3F]">
            {getTranslation(lang, 'employeesTitle')}
          </h2>
        </div>

        {/* Employee Form Card */}
        <div id="employee-form-card" className="bg-white border border-[#DFD5BE] rounded-xl p-5 shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* 3 Inputs in One Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#5B6B74] mb-1">
                  {getTranslation(lang, 'empNameLabel')}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder={lang === 'ar' ? 'اسم الموظف' : 'Nom de l\'employé'}
                  required
                  className="w-full p-2.5 bg-[#FAF6EE] border border-[#DFD5BE] rounded-xl text-sm font-semibold outline-none focus:border-[#C99A3E] focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5B6B74] mb-1">
                  {getTranslation(lang, 'empUserLabel')}
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="username"
                  required
                  className="w-full p-2.5 bg-[#FAF6EE] border border-[#DFD5BE] rounded-xl text-sm font-semibold mono outline-none focus:border-[#C99A3E] focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5B6B74] mb-1">
                  {getTranslation(lang, 'empPassLabel')}
                </label>
                <div className="relative">
                  <input
                    type={showFormPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full p-2.5 pe-10 bg-[#FAF6EE] border border-[#DFD5BE] rounded-xl text-sm font-semibold outline-none focus:border-[#C99A3E] focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowFormPassword(!showFormPassword)}
                    className="absolute end-2.5 top-1/2 -translate-y-1/2 text-[#5B6B74] hover:text-[#0B1E3F] p-1 cursor-pointer"
                    title={showFormPassword ? 'Hide' : 'Show'}
                  >
                    {showFormPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Admin Checkbox */}
            <div className="pt-1">
              <label className="flex items-center gap-2 text-xs font-extrabold text-[#0B1E3F] cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isAdmin}
                  onChange={e => setIsAdmin(e.target.checked)}
                  className="w-4 h-4 rounded text-[#C99A3E] accent-[#C99A3E] cursor-pointer"
                />
                <span>{getTranslation(lang, 'empRoleAdmin')}</span>
              </label>
            </div>

            {/* Permissions Checkboxes */}
            <div className="pt-2">
              <span className="text-xs font-bold text-[#5B6B74] block mb-2">
                {getTranslation(lang, 'empPermissionsTitle')}
              </span>
              <div className="flex flex-wrap items-center gap-4 bg-[#FAF6EE] p-3 rounded-xl border border-[#DFD5BE]">
                {assignableTabs.map(t => {
                  const isChecked = isAdmin || selectedPermissions.includes(t.id);
                  return (
                    <label 
                      key={t.id} 
                      className={`flex items-center gap-2 text-xs font-bold select-none cursor-pointer transition-colors ${
                        isAdmin ? 'opacity-60 cursor-not-allowed text-[#5B6B74]' : 'text-[#0B1E3F] hover:text-[#C99A3E]'
                      }`}
                    >
                      <input
                        type="checkbox"
                        disabled={isAdmin}
                        checked={isChecked}
                        onChange={() => handleTogglePerm(t.id)}
                        className="w-4 h-4 rounded accent-[#0B1E3F] cursor-pointer"
                      />
                      <span>{t.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Actions: Add / Save / Cancel / Delete */}
            <div className="flex items-center justify-between pt-2">
              <div>
                {editingId && users.find(u => u.id === editingId)?.username !== 'moneb' && (
                  <button
                    type="button"
                    onClick={() => {
                      const u = users.find(x => x.id === editingId);
                      if (u) setUserToDelete(u);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-600 hover:text-white font-bold text-xs transition-all cursor-pointer shadow-sm"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{lang === 'ar' ? 'حذف هذا الموظف' : 'Supprimer cet employé'}</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#DFD5BE] text-[#5B6B74] hover:text-[#0B1E3F] font-bold text-xs transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{lang === 'ar' ? 'إلغاء التعديل' : 'Annuler'}</span>
                  </button>
                )}
                
                <button
                  type="submit"
                  id="btn-submit-employee"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0B1E3F] hover:bg-[#061022] text-[#C99A3E] hover:text-white font-extrabold text-xs transition-all cursor-pointer shadow-md"
                >
                  {editingId ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{lang === 'ar' ? 'حفظ التعديلات' : 'Enregistrer les modifications'}</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>{getTranslation(lang, 'saveEmployeeBtn')}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Users Table - Matching Bourwe Screenshot */}
        <div className="overflow-x-auto rounded-xl border border-[#DFD5BE] bg-white">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-[#FAF6EE] border-b border-[#DFD5BE] text-[12px] font-extrabold text-[#5B6B74]">
                <th className="py-3 px-4 text-start font-bold">الاسم</th>
                <th className="py-3 px-4 text-start font-bold">اسم المستخدم</th>
                <th className="py-3 px-4 text-start font-bold">الدور</th>
                <th className="py-3 px-4 text-start font-bold">الصلاحيات</th>
                <th className="py-3 px-4 text-center font-bold">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DFD5BE]/60">
              {users.map(u => (
                <tr 
                  key={u.id} 
                  className={`hover:bg-[#C99A3E]/5 transition-colors ${editingId === u.id ? 'bg-[#C99A3E]/10' : ''}`}
                >
                  <td className="py-3.5 px-4 font-bold text-[#0B1E3F] text-sm">
                    {u.name}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-[#22303A] mono">
                    {u.username}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-block px-3 py-1 rounded-md text-xs font-extrabold ${
                      u.role === 'admin' 
                        ? 'bg-[#0B1E3F] text-[#C99A3E]' 
                        : 'bg-slate-200 text-slate-800'
                    }`}>
                      {u.role === 'admin' ? (lang === 'ar' ? 'مدير' : 'Directeur') : (lang === 'ar' ? 'موظف' : 'Employé')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-xs font-semibold text-[#5B6B74] max-w-md leading-relaxed">
                    {getPermissionLabels(u)}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleStartEdit(u)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-[#0B1E3F] text-[#0B1E3F] hover:text-[#C99A3E] font-bold transition-all cursor-pointer border border-slate-200"
                        title={lang === 'ar' ? 'تعديل' : 'Modifier'}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>{lang === 'ar' ? 'تعديل' : 'Modifier'}</span>
                      </button>

                      {u.username !== 'moneb' ? (
                        <button
                          onClick={() => setUserToDelete(u)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white font-bold transition-all cursor-pointer border border-rose-200"
                          title={lang === 'ar' ? 'حذف' : 'Supprimer'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>{lang === 'ar' ? 'حذف' : 'Supprimer'}</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setPasswordModalUser(u);
                            setNewPasswordVal(u.password);
                            setShowPasswordVal(false);
                          }}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#C99A3E]/15 hover:bg-[#C99A3E] text-[#0B1E3F] hover:text-white font-bold transition-all cursor-pointer border border-[#C99A3E]/30"
                          title={lang === 'ar' ? 'كلمة المرور' : 'Mot de passe'}
                        >
                          <Key className="w-3.5 h-3.5" />
                          <span>{lang === 'ar' ? 'الباسورد' : 'MDP'}</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Change Password Modal */}
        {passwordModalUser && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#FFFDF8] border border-[#DFD5BE] rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-[#DFD5BE] mb-4">
                <div className="flex items-center gap-2 font-black text-[#0B1E3F] text-base">
                  <Key className="w-5 h-5 text-[#C99A3E]" />
                  <span>
                    {lang === 'ar' ? 'تغيير كلمة المرور' : 'Modifier le mot de passe'}
                  </span>
                </div>
                <button
                  onClick={() => setPasswordModalUser(null)}
                  className="p-1 rounded-lg text-[#5B6B74] hover:bg-slate-100 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-[#5B6B74] mb-1">
                    {lang === 'ar' ? 'المستخدم' : 'Utilisateur'}
                  </label>
                  <p className="font-bold text-sm text-[#0B1E3F]">
                    {passwordModalUser.name} ({passwordModalUser.username})
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5B6B74] mb-1">
                    {lang === 'ar' ? 'كلمة المرور الجديدة' : 'Nouveau mot de passe'}
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswordVal ? 'text' : 'password'}
                      value={newPasswordVal}
                      onChange={e => setNewPasswordVal(e.target.value)}
                      placeholder="••••••"
                      className="w-full p-2.5 pe-10 bg-white border border-[#DFD5BE] rounded-xl text-sm font-semibold outline-none focus:border-[#C99A3E]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswordVal(!showPasswordVal)}
                      className="absolute end-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPasswordVal ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setPasswordModalUser(null)}
                    className="px-4 py-2 rounded-xl border border-[#DFD5BE] text-xs font-bold text-[#5B6B74] hover:bg-slate-100"
                  >
                    {lang === 'ar' ? 'إلغاء' : 'Annuler'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (onUpdatePassword && newPasswordVal.trim()) {
                        onUpdatePassword(passwordModalUser.id, newPasswordVal.trim());
                      }
                      setPasswordModalUser(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#0B1E3F] text-[#C99A3E] hover:text-white text-xs font-extrabold shadow-md"
                  >
                    {lang === 'ar' ? 'تحديث كلمة المرور' : 'Mettre à jour'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {userToDelete && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#FFFDF8] border border-[#DFD5BE] rounded-2xl p-6 max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center gap-3 pb-3 border-b border-[#DFD5BE] mb-4">
                <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-[#0B1E3F] text-base">
                    {lang === 'ar' ? 'تأكيد حذف الموظف' : 'Confirmer la suppression'}
                  </h3>
                  <p className="text-xs text-[#5B6B74]">
                    {lang === 'ar' ? 'هذا الإجراء نهائي وسيتم إلغاء وصول الموظف فوراً' : 'Cette action est irréversible'}
                  </p>
                </div>
              </div>

              <div className="bg-rose-50 border border-rose-200/80 rounded-xl p-3.5 mb-5 text-xs text-[#0B1E3F]">
                <p className="font-bold mb-1 text-slate-700">
                  {lang === 'ar' ? 'هل أنت متأكد من رغبتك في حذف حساب الموظف:' : 'Voulez-vous vraiment supprimer le compte de :'}
                </p>
                <div className="font-extrabold text-sm text-rose-700 flex items-center justify-between mt-1.5 bg-white p-2.5 rounded-lg border border-rose-100">
                  <span>{userToDelete.name}</span>
                  <span className="mono text-xs text-rose-500 font-semibold">@{userToDelete.username}</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setUserToDelete(null)}
                  className="px-4 py-2.5 rounded-xl border border-[#DFD5BE] text-[#5B6B74] hover:text-[#0B1E3F] font-bold text-xs transition-all cursor-pointer bg-white"
                >
                  {lang === 'ar' ? 'إلغاء' : 'Annuler'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const idToDelete = userToDelete.id;
                    setUserToDelete(null);
                    onDeleteUser(idToDelete);
                    if (editingId === idToDelete) {
                      handleCancelEdit();
                    }
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs transition-all cursor-pointer shadow-md"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'نعم، حذف الموظف' : 'Oui, Supprimer'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
