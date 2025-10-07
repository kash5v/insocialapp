import ProfileHeader from '../ProfileHeader';

export default function ProfileHeaderExample() {
  return (
    <div className="max-w-2xl mx-auto">
      <ProfileHeader
        displayName="Priya Sharma"
        username="priya.sharma"
        bio="Digital Creator | Travel Enthusiast 🌏 | Mumbai 📍"
        isVerified={true}
        posts={342}
        followers={15420}
        following={892}
        isOwnProfile={false}
        isFollowing={false}
        isFriend={false}
      />
    </div>
  );
}
