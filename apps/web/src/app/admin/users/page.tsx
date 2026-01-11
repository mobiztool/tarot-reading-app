'use client';

/**
 * Admin Users List Page
 * 
 * แสดงรายชื่อ users ที่สมัครในระบบ
 */

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { PageLoader } from '@/components/ui/MysticalLoader';

// =============================================================================
// TYPES
// =============================================================================

interface UserData {
  id: string;
  email: string;
  created_at: string;
  email_confirmed_at: string | null;
  last_sign_in_at: string | null;
  role: string | null;
  readings_count?: number;
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function AdminUsersPage() {
  const router = useRouter();
  const { user: authUser, isLoading: authLoading } = useAuth();
  
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'created_at' | 'email' | 'last_sign_in_at'>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/admin/users');
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch users');
      }

      setUsers(data.users || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && !authUser) {
      router.push('/auth/login?redirectTo=/admin/users');
      return;
    }

    if (authUser) {
      // Check admin access
      const isAdmin = authUser.user_metadata?.role === 'admin' || 
                     authUser.email?.endsWith('@admin.tarotapp.com');
      if (!isAdmin) {
        router.push('/');
        return;
      }
      fetchUsers();
    }
  }, [authUser, authLoading, fetchUsers, router]);

  // Filter and sort users
  const filteredUsers = users
    .filter(u => 
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aVal = a[sortBy] || '';
      const bVal = b[sortBy] || '';
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      }
      return aVal < bVal ? 1 : -1;
    });

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  if (authLoading || loading) {
    return <PageLoader message="กำลังโหลดข้อมูลผู้ใช้..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-950/20 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <p className="text-red-400 mb-4">{error}</p>
          <button 
            onClick={fetchUsers}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500"
          >
            ลองใหม่
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-950/20 to-slate-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Back Link */}
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          กลับไป Admin Dashboard
        </Link>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              👥 รายชื่อผู้ใช้งาน
            </h1>
            <p className="text-slate-400 mt-1">
              ทั้งหมด {users.length} คน
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Search */}
            <input
              type="text"
              placeholder="ค้นหาอีเมล..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-white px-4 py-2 rounded-lg w-64 placeholder-slate-500"
            />
            
            {/* Refresh */}
            <button
              onClick={fetchUsers}
              className="px-4 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg hover:bg-slate-700"
            >
              🔄
            </button>

            {/* Link to Analytics */}
            <Link
              href="/admin/analytics/spreads"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500"
            >
              📊 Analytics
            </Link>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-700/50 text-slate-300">
                  <th className="text-left py-4 px-4">#</th>
                  <th 
                    className="text-left py-4 px-4 cursor-pointer hover:text-white"
                    onClick={() => handleSort('email')}
                  >
                    อีเมล {sortBy === 'email' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="text-center py-4 px-4">ยืนยันอีเมล</th>
                  <th 
                    className="text-left py-4 px-4 cursor-pointer hover:text-white"
                    onClick={() => handleSort('created_at')}
                  >
                    วันที่สมัคร {sortBy === 'created_at' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="text-left py-4 px-4 cursor-pointer hover:text-white"
                    onClick={() => handleSort('last_sign_in_at')}
                  >
                    เข้าใช้ล่าสุด {sortBy === 'last_sign_in_at' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="text-center py-4 px-4">Role</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-slate-500">
                      {searchTerm ? 'ไม่พบผู้ใช้ที่ค้นหา' : 'ยังไม่มีผู้ใช้ในระบบ'}
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user, index) => (
                    <tr 
                      key={user.id} 
                      className="border-t border-slate-700/50 hover:bg-slate-700/30 transition-colors"
                    >
                      <td className="py-4 px-4 text-slate-500">{index + 1}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">{user.email}</span>
                          {user.email.endsWith('@admin.tarotapp.com') && (
                            <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded-full">
                              Admin
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        {user.email_confirmed_at ? (
                          <span className="text-green-400">✓</span>
                        ) : (
                          <span className="text-yellow-400">⏳</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-slate-300">
                        {formatDate(user.created_at)}
                      </td>
                      <td className="py-4 px-4 text-slate-300">
                        {formatDate(user.last_sign_in_at)}
                      </td>
                      <td className="py-4 px-4 text-center">
                        {user.role === 'admin' ? (
                          <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">
                            Admin
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-slate-600/50 text-slate-400 text-xs rounded-full">
                            User
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
            <div className="text-slate-400 text-sm">ทั้งหมด</div>
            <div className="text-2xl font-bold text-white">{users.length}</div>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
            <div className="text-slate-400 text-sm">ยืนยันอีเมลแล้ว</div>
            <div className="text-2xl font-bold text-green-400">
              {users.filter(u => u.email_confirmed_at).length}
            </div>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
            <div className="text-slate-400 text-sm">รอยืนยัน</div>
            <div className="text-2xl font-bold text-yellow-400">
              {users.filter(u => !u.email_confirmed_at).length}
            </div>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
            <div className="text-slate-400 text-sm">Admin</div>
            <div className="text-2xl font-bold text-purple-400">
              {users.filter(u => u.role === 'admin' || u.email.endsWith('@admin.tarotapp.com')).length}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-slate-500 text-sm">
          อัปเดตล่าสุด: {new Date().toLocaleString('th-TH')}
        </div>
      </div>
    </div>
  );
}

