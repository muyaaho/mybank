import { renderHook, act } from '@testing-library/react'
import { useAssetStore } from '@/stores/assetStore'
import { AssetType } from '@/types/api'

describe('assetStore', () => {
  beforeEach(() => {
    useAssetStore.setState({
      assets: [],
      totalBalance: 0,
      currency: 'KRW',
      categoryBreakdown: [],
      isLoading: false,
      error: null,
    })
  })

  it('should set assets correctly', () => {
    const { result } = renderHook(() => useAssetStore())

    act(() => {
      result.current.setAssets({
        totalBalance: 1000000,
        currency: 'KRW',
        assets: [
          {
            id: 'asset-1',
            assetType: AssetType.BANK,
            institutionName: 'Test Bank',
            accountName: 'Savings',
            balance: 1000000,
            currentValue: 1000000,
          },
        ],
        categoryBreakdown: [
          {
            assetType: AssetType.BANK,
            totalValue: 1000000,
            count: 1,
          },
        ],
      })
    })

    expect(result.current.totalBalance).toBe(1000000)
    expect(result.current.assets).toHaveLength(1)
    expect(result.current.categoryBreakdown).toHaveLength(1)
    expect(result.current.error).toBeNull()
  })

  it('should clear assets', () => {
    const { result } = renderHook(() => useAssetStore())

    act(() => {
      result.current.setAssets({
        totalBalance: 1000000,
        currency: 'KRW',
        assets: [],
        categoryBreakdown: [],
      })
    })

    act(() => {
      result.current.clearAssets()
    })

    expect(result.current.totalBalance).toBe(0)
    expect(result.current.assets).toHaveLength(0)
    expect(result.current.categoryBreakdown).toHaveLength(0)
  })

  it('should handle loading state', () => {
    const { result } = renderHook(() => useAssetStore())

    act(() => {
      result.current.setLoading(true)
    })

    expect(result.current.isLoading).toBe(true)

    act(() => {
      result.current.setLoading(false)
    })

    expect(result.current.isLoading).toBe(false)
  })

  it('should set error', () => {
    const { result } = renderHook(() => useAssetStore())

    act(() => {
      result.current.setError('Test error')
    })

    expect(result.current.error).toBe('Test error')
    expect(result.current.isLoading).toBe(false)
  })
})
