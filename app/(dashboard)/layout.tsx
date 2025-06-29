import { Navbar } from './_components/navbar'
import { Footer } from './_components/footer'

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full bg-white flex flex-col">
      <div className="min-[890px]:h-20 min-[890px]:inset-y-0 min-[890px]:w-full min-[890px]:z-30">
        <Navbar />
      </div>
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  )
}

export default DashboardLayout
