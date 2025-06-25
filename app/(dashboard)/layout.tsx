import { Navbar } from './_components/navbar'
import { Footer } from './_components/footer' // Import the new Footer

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    // Use flexbox to make the footer stick to the bottom
    <div className="h-full bg-white flex flex-col">
      <div className=" md:h-20 md:inset-y-0 md:w-full md:z-30">
        <Navbar />
      </div>
      <main className="flex-grow ">{children}</main>
      <Footer />
    </div>
  )
}

export default DashboardLayout
