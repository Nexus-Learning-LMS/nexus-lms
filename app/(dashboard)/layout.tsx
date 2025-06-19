import { Navbar } from './_components/navbar'
import { Sidebar } from './_components/sidebar'

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full bg-white">
      <div className="h-20 inset-y-0 w-full z-50">
        <Navbar />
      </div>

      <main className="h-full">{children}</main>
    </div>
  )
}

export default DashboardLayout
