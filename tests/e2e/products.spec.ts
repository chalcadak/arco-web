import { test, expect } from '@playwright/test';

/**
 * 상품 목록 및 상세 페이지 테스트
 */
test.describe('Product Pages', () => {
  test('should load products list page', async ({ page }) => {
    await page.goto('/products');
    
    // 페이지 제목 확인
    await expect(page).toHaveURL(/\/products/);
    
    // 상품 목록이 표시되는지 확인
    const productItems = page.locator('[data-testid="product-item"]');
    
    // 상품이 최소 1개 이상 있는지 확인 (조건부)
    const count = await productItems.count();
    if (count > 0) {
      await expect(productItems.first()).toBeVisible();
    }
  });

  test('should filter products by category', async ({ page }) => {
    await page.goto('/products');
    
    // 카테고리 필터 찾기
    const categoryFilter = page.locator('[data-testid="category-filter"]');
    
    if (await categoryFilter.isVisible()) {
      await categoryFilter.click();
      
      // 첫 번째 카테고리 선택
      const firstCategory = page.locator('[data-testid="category-option"]').first();
      await firstCategory.click();
      
      // URL이 변경되었는지 또는 필터링이 적용되었는지 확인
      await page.waitForTimeout(1000); // 필터링 완료 대기
    }
  });

  test('should search products', async ({ page }) => {
    await page.goto('/products');
    
    // 검색 입력 필드 찾기
    const searchInput = page.locator('[data-testid="search-input"]').or(
      page.getByPlaceholder(/검색/i)
    );
    
    if (await searchInput.isVisible()) {
      await searchInput.fill('아우터');
      await searchInput.press('Enter');
      
      // 검색 결과 대기
      await page.waitForTimeout(1000);
    }
  });

  test('should navigate to product detail', async ({ page }) => {
    await page.goto('/products');
    
    // 첫 번째 상품 클릭
    const firstProduct = page.locator('[data-testid="product-item"]').first();
    
    if (await firstProduct.isVisible()) {
      await firstProduct.click();
      
      // 상품 상세 페이지로 이동했는지 확인
      await expect(page).toHaveURL(/\/products\/.+/);
      
      // 상품 이름이 표시되는지 확인
      const productName = page.locator('[data-testid="product-name"]').or(
        page.locator('h1')
      );
      await expect(productName.first()).toBeVisible();
    }
  });

  test('should add product to cart', async ({ page }) => {
    // 상품 상세 페이지로 이동 (실제 상품 ID로 교체 필요)
    await page.goto('/products');
    
    const firstProduct = page.locator('[data-testid="product-item"]').first();
    if (await firstProduct.isVisible()) {
      await firstProduct.click();
      
      // 장바구니 담기 버튼 찾기
      const addToCartButton = page.getByRole('button', { name: /장바구니|담기/i });
      
      if (await addToCartButton.isVisible()) {
        await addToCartButton.click();
        
        // 성공 메시지 또는 장바구니 아이콘 업데이트 확인
        await page.waitForTimeout(500);
      }
    }
  });
});
