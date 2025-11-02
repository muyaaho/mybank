import { renderHook, act } from '@testing-library/react'
import { useInvestmentStore } from '@/stores/investmentStore'
import { InvestmentType } from '@/types/api'

describe('investmentStore', () => {
  beforeEach(() => {
    useInvestmentStore.setState({
      totalInvested: 0,
      totalRoundedUp: 0,
      totalRoundUpTransactions: 0,
      recentInvestments: [],
      roundUpEnabled: false,
      isLoading: false,
      error: null,
    })
  })

  it('should set investment summary', () => {
    const { result } = renderHook(() => useInvestmentStore())

    act(() => {
      result.current.setSummary({
        totalInvested: 500000,
        totalRoundedUp: 50000,
        totalRoundUpTransactions: 100,
        recentInvestments: [
          {
            investmentId: 'inv-1',
            productName: 'Growth Fund',
            investmentType: InvestmentType.ROUNDUP,
            amount: 1000,
            investedAt: '2024-01-01T00:00:00Z',
          },
        ],
      })
    })

    expect(result.current.totalInvested).toBe(500000)
    expect(result.current.totalRoundedUp).toBe(50000)
    expect(result.current.totalRoundUpTransactions).toBe(100)
    expect(result.current.recentInvestments).toHaveLength(1)
  })

  it('should toggle round-up enabled', () => {
    const { result } = renderHook(() => useInvestmentStore())

    act(() => {
      result.current.setRoundUpEnabled(true)
    })

    expect(result.current.roundUpEnabled).toBe(true)

    act(() => {
      result.current.setRoundUpEnabled(false)
    })

    expect(result.current.roundUpEnabled).toBe(false)
  })

  it('should clear investments', () => {
    const { result } = renderHook(() => useInvestmentStore())

    act(() => {
      result.current.setSummary({
        totalInvested: 500000,
        totalRoundedUp: 50000,
        totalRoundUpTransactions: 100,
        recentInvestments: [],
      })
    })

    act(() => {
      result.current.clearInvestments()
    })

    expect(result.current.totalInvested).toBe(0)
    expect(result.current.totalRoundedUp).toBe(0)
    expect(result.current.roundUpEnabled).toBe(false)
  })
})
