import AppTopBar from '../AppTopBar';

export default function AppTopBarExample() {
  return (
    <div className="space-y-4">
      <AppTopBar title="INSocial" showBack={false} />
      <AppTopBar title="Profile" showBack={true} />
    </div>
  );
}
