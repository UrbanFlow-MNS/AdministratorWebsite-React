import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { DashboardPage } from '../pages/DashboardPage';
import { StopsPage } from '../pages/StopsPage';
import { CreateStopPage } from '../pages/CreateStopPage';
import { EditStopPage } from '../pages/EditStopPage';
import { RoutesPage } from '../pages/RoutesPage';
import { CreateRoutePage } from '../pages/CreateRoutePage';

const VehiclesPage = lazy(() => import('../pages/VehiclesPage'));
const CreateVehiclePage = lazy(() => import('../pages/CreateVehiclePage'));
const CalendarPage = lazy(() => import('../pages/CalendarPage'));
const CreateCalendarPage = lazy(() => import('../pages/CreateCalendarPage'));

export function AppRouter() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="stops" element={<StopsPage />} />
          <Route path="stops/create" element={<CreateStopPage />} />
          <Route path="stops/:id/edit" element={<EditStopPage />} />
          <Route path="routes" element={<RoutesPage />} />
          <Route path="routes/create" element={<CreateRoutePage />} />
          <Route path="vehicles" element={<VehiclesPage />} />
          <Route path="vehicles/create" element={<CreateVehiclePage />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="calendar/create" element={<CreateCalendarPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
