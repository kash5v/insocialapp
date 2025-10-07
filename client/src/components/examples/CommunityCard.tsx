import CommunityCard from '../CommunityCard';

export default function CommunityCardExample() {
  return (
    <div className="max-w-2xl mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      <CommunityCard
        name="Tech Enthusiasts India"
        handle="tech_india"
        description="Join the largest tech community in India. Share knowledge, discuss latest trends, and network with professionals."
        memberCount={45230}
        isJoined={false}
      />
      <CommunityCard
        name="Mumbai Foodies"
        handle="mumbai_food"
        description="Discover the best food spots in Mumbai! Share your culinary adventures and connect with food lovers."
        memberCount={12840}
        isJoined={true}
      />
    </div>
  );
}
