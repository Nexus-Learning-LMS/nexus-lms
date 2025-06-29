import { Navbar } from './_components/navbar'
import { Footer } from './_components/footer' // Import the new Footer

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full bg-white flex flex-col">
      <div className="h-[80px] min-[890px]:fixed min-[890px]:inset-y-0 min-[890px]:w-full min-[890px]:z-50">
        <Navbar />
      </div>
      <main className="flex-grow min-[890px]:pt-[80px]">{children}</main>
      <Footer />
    </div>
  )
}

export default DashboardLayout
