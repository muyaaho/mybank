'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { authApi } from '@/lib/api/endpoints';
import { apiClient } from '@/lib/api/client';
import { useAuthStore } from '@/stores/authStore';

const registerSchema = z.object({
  email: z.string().email('유효한 이메일을 입력하세요'),
  password: z
    .string()
    .min(8, '비밀번호는 최소 8자 이상이어야 합니다')
    .regex(/[0-9]/, '비밀번호는 숫자를 포함해야 합니다')
    .regex(/[a-z]/, '비밀번호는 소문자를 포함해야 합니다')
    .regex(/[A-Z]/, '비밀번호는 대문자를 포함해야 합니다')
    .regex(/[@#$%^&+=]/, '비밀번호는 특수문자(@#$%^&+=)를 포함해야 합니다'),
  confirmPassword: z.string(),
  name: z.string().min(2, '이름은 최소 2자 이상이어야 합니다'),
  phoneNumber: z
    .string()
    .regex(/^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/, '유효한 전화번호를 입력하세요 (예: 010-1234-5678)'),
}).refine((data) => data.password === data.confirmPassword, {
  message: '비밀번호가 일치하지 않습니다',
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError('');

    try {
      const { confirmPassword, ...registerData } = data;
      const response = await authApi.register(registerData);

      if (response.success) {
        // Store tokens and user info
        apiClient.setAuth(response.data.accessToken, response.data.refreshToken);
        setUser(response.data.user);

        // Redirect to dashboard
        router.push('/dashboard');
      } else {
        setError(response.message || '회원가입에 실패했습니다');
      }
    } catch (err: any) {
      console.error('Register error:', err);
      setError(err.response?.data?.message || '회원가입 중 오류가 발생했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 py-12">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">MyBank 360</h1>
          <p className="text-gray-600 mt-2">회원가입</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <Input
            label="이메일"
            type="email"
            placeholder="example@email.com"
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            label="이름"
            type="text"
            placeholder="홍길동"
            error={errors.name?.message}
            {...register('name')}
          />

          <Input
            label="전화번호"
            type="tel"
            placeholder="010-1234-5678"
            error={errors.phoneNumber?.message}
            {...register('phoneNumber')}
          />

          <Input
            label="비밀번호"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
          />

          <Input
            label="비밀번호 확인"
            type="password"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          <div className="text-xs text-gray-500 space-y-1">
            <p>• 최소 8자 이상</p>
            <p>• 숫자, 소문자, 대문자, 특수문자(@#$%^&+=) 각 1개 이상 포함</p>
          </div>

          <Button type="submit" className="w-full" isLoading={isLoading}>
            회원가입
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            이미 계정이 있으신가요?{' '}
            <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
