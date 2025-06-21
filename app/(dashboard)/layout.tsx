import { Navbar } from './_components/navbar'

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full bg-white">
      <div className=" md:h-20 md:inset-y-0 md:w-full md:z-30">
        <Navbar />
      </div>
      <main className="h-full">{children}</main>
    </div>
  )
}

export default DashboardLayout
