import GradesTable from "../components/GradesTable"

export default function Landing({title}) {
    return (
        <div className="flex flex-col w-full h-full p-10 space-y-10">
            <div className="flex flex-col space-y-1">
                <h1 className="text-3xl font-bold">Welcome to {title}.ai</h1>
                <p>This will serve as the base project file for my Quiz / Reviewer Generator using Vicuna 13-B LLM</p>
                <p>This project is also built with Tailwind.css</p>
            </div>
            <p>et, consectetur adipiscing elit. Maecenas tortor odio, varius ac velit ac, consequat pharetra felis. Vestibulum varius ante orci, sed accumsan nunc vestibulum sed. Quisque vitae odio vitae lorem ultrices blandit sit amet in odio. Quisque tincidunt lacinia lacus vel iaculis. Duis gravida quis est et egestas. Curabitur sollicitudin, massa vitae sodales tincidunt, diam erat fringilla diam, nec euismod velit ligula sit amet metus. Maecenas felis neque, sodales nec nisi in, pharetra consequat eros. Proin semper tortor eget imperdiet pellentesque. Nulla eu tempor elit. Nunc gravida mi ac tortor luctus rhoncus. Aenean ut sem a mi ultrices sagittis. Vestibulum at cursus mi. Duis nec ex a arcu vehicula semper. Nullam ultricies eros at tristique euismod. Morbi rhoncus lobortis ipsum.</p>
            <div className="flex flex-col space-y-1">
                <h1 className="text-3xl font-bold">Usage</h1>
            </div>
            <div className="flex flex-col space-y-1">
                <h1 className="text-3xl font-bold">Grade Calculator</h1>
                <GradesTable />
            </div>
        </div>
    )
}