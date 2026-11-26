import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import StudentsList from './pages/StudentsList.jsx'
import StudentDetail from './pages/StudentDetail.jsx'
import StudentNew from './pages/StudentNew.jsx'
import StudentEdit from './pages/StudentEdit.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/etudiants" element={<StudentsList />} />
          <Route path="/etudiants/nouveau" element={<StudentNew />} />
          <Route path="/etudiants/:id" element={<StudentDetail />} />
          <Route path="/etudiants/:id/modifier" element={<StudentEdit />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
