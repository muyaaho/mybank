import { renderHook, act } from '@testing-library/react'
import { usePaymentStore } from '@/stores/paymentStore'
import { PaymentStatus } from '@/types/api'

describe('paymentStore', () => {
  beforeEach(() => {
    usePaymentStore.setState({
      payments: [],
      currentPayment: null,
      totalPages: 0,
      totalElements: 0,
      isLoading: false,
      error: null,
    })
  })

  it('should set payments correctly', () => {
    const { result } = renderHook(() => usePaymentStore())

    const mockPayments = [
      {
        paymentId: 'payment-1',
        status: PaymentStatus.COMPLETED,
        amount: 10000,
        currency: 'KRW',
        recipientName: 'John Doe',
        createdAt: '2024-01-01T00:00:00Z',
        message: 'Test payment',
      },
    ]

    act(() => {
      result.current.setPayments({
        payments: mockPayments,
        totalPages: 1,
        totalElements: 1,
      })
    })

    expect(result.current.payments).toHaveLength(1)
    expect(result.current.totalPages).toBe(1)
    expect(result.current.totalElements).toBe(1)
  })

  it('should add payment', () => {
    const { result } = renderHook(() => usePaymentStore())

    const newPayment = {
      paymentId: 'payment-1',
      status: PaymentStatus.COMPLETED,
      amount: 10000,
      currency: 'KRW',
      recipientName: 'John Doe',
      createdAt: '2024-01-01T00:00:00Z',
      message: 'Test payment',
    }

    act(() => {
      result.current.addPayment(newPayment)
    })

    expect(result.current.payments).toHaveLength(1)
    expect(result.current.currentPayment).toEqual(newPayment)
  })

  it('should clear payments', () => {
    const { result } = renderHook(() => usePaymentStore())

    act(() => {
      result.current.addPayment({
        paymentId: 'payment-1',
        status: PaymentStatus.COMPLETED,
        amount: 10000,
        currency: 'KRW',
        recipientName: 'John Doe',
        createdAt: '2024-01-01T00:00:00Z',
        message: 'Test payment',
      })
    })

    act(() => {
      result.current.clearPayments()
    })

    expect(result.current.payments).toHaveLength(0)
    expect(result.current.currentPayment).toBeNull()
  })
})
