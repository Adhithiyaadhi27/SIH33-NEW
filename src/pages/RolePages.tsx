import FarmerDashboard from '../components/roles/FarmerDashboard';
import RoleCockpit from '../components/roles/RoleCockpit';

export function FarmerPage() {
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-24">
      <FarmerDashboard />
    </div>
  );
}

interface GenericPageProps {
  role: string;
  tagline: string;
}

export function GenericRolePage({ role, tagline }: GenericPageProps) {
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-24">
      <RoleCockpit role={role} tagline={tagline} />
    </div>
  );
}