import MusicTrackTile from '../MusicTrackTile';

export default function MusicTrackTileExample() {
  const tracks = [
    { title: "Kesariya", artist: "Arijit Singh", duration: "4:28" },
    { title: "Apna Bana Le", artist: "Arijit Singh", duration: "3:56" },
    { title: "Excuses", artist: "AP Dhillon", duration: "2:43" },
    { title: "Raataan Lambiyan", artist: "Jubin Nautiyal", duration: "3:23" },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="font-display font-bold text-2xl mb-4">Trending Music</h2>
      <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
        {tracks.map((track) => (
          <MusicTrackTile key={track.title} {...track} />
        ))}
      </div>
    </div>
  );
}
