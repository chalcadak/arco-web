import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">ARCO</h3>
            <p className="text-sm text-muted-foreground">
              프리미엄 반려견 패션 브랜드
            </p>
            <p className="text-xs text-muted-foreground">
              &quot;DOGUE&quot; - 반려견을 위한 하이패션
            </p>
          </div>

          {/* Shop */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">쇼핑</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/products" className="hover:text-foreground transition-colors">
                  판매상품
                </Link>
              </li>
              <li>
                <Link href="/photoshoots" className="hover:text-foreground transition-colors">
                  촬영룩
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-foreground transition-colors">
                  장바구니
                </Link>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">정보</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-foreground transition-colors">
                  브랜드 소개
                </Link>
              </li>
              <li>
                <Link href="/process" className="hover:text-foreground transition-colors">
                  촬영 프로세스
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-foreground transition-colors">
                  자주 묻는 질문
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">고객센터</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/contact" className="hover:text-foreground transition-colors">
                  문의하기
                </Link>
              </li>
              <li>이메일: contact@arco.com</li>
              <li>운영시간: 평일 10:00-18:00</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} ARCO. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
