const CardComponent = () => {
  return (
    <div className="flex justify-center">
      <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <a href="#">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Category Title</h5>
        </a>
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Suscipit pariatur quisquam possimus itaque repudiandae officia quam accusamus sunt doloremque tempore assumenda, iure ex dolores nisi nemo laudantium fugiat ut inventore.</p>
        <div className="w-full flex justify-end">
          <button
            type="button" 
            className="inline-flex items-center px-6 py-2 text-sm font-medium text-center text-white bg-green-500 rounded-lg hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          >
            Start
          </button>
        </div>
      </div>
    </div>
  )
}

const StudentCategoryPage = () => {
  return ( 
    <div className="w-full p-12 flex flex-col">
      <div className="w-full py-3 pl-7 border-b">
        <span className="font-bold text-3xl">Categories</span>
      </div>
      <div className="grid grid-cols-4 gap-4 mt-4">
        <CardComponent />
        <CardComponent />
        <CardComponent />
        <CardComponent />
        <CardComponent />
      </div>
    </div>
  )
}

export default StudentCategoryPage
