import {RootState} from "./../../redux"
import {useSelector} from "react-redux"
import AdminCategoryPage from "./category-page-content/for-admin"
import StudentCategoryPage from "./category-page-content/for-student"

const CategoryPage = () => {
  const role: "student" | "admin" = useSelector((state: RootState) => state.userdata.role)

  return role === "admin" ? <AdminCategoryPage /> : <StudentCategoryPage />
}

export default CategoryPage
