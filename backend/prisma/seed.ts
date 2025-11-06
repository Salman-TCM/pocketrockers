import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const tracks = [
  { title: 'Bohemian Rhapsody', artist: 'Queen', album: 'A Night at the Opera', duration_seconds: 355, genre: 'Rock' },
  { title: 'Stairway to Heaven', artist: 'Led Zeppelin', album: 'Led Zeppelin IV', duration_seconds: 482, genre: 'Rock' },
  { title: 'Hotel California', artist: 'Eagles', album: 'Hotel California', duration_seconds: 391, genre: 'Rock' },
  { title: 'Imagine', artist: 'John Lennon', album: 'Imagine', duration_seconds: 183, genre: 'Pop' },
  { title: 'Sweet Child O\' Mine', artist: 'Guns N\' Roses', album: 'Appetite for Destruction', duration_seconds: 356, genre: 'Rock' },
  { title: 'Billie Jean', artist: 'Michael Jackson', album: 'Thriller', duration_seconds: 294, genre: 'Pop' },
  { title: 'Like a Rolling Stone', artist: 'Bob Dylan', album: 'Highway 61 Revisited', duration_seconds: 370, genre: 'Folk Rock' },
  { title: 'Purple Haze', artist: 'Jimi Hendrix', album: 'Are You Experienced', duration_seconds: 167, genre: 'Rock' },
  { title: 'Yesterday', artist: 'The Beatles', album: 'Yesterday and Today', duration_seconds: 125, genre: 'Pop' },
  { title: 'Satisfaction', artist: 'The Rolling Stones', album: 'Out of Our Heads', duration_seconds: 223, genre: 'Rock' },
  { title: 'What\'s Going On', artist: 'Marvin Gaye', album: 'What\'s Going On', duration_seconds: 232, genre: 'Soul' },
  { title: 'Good Vibrations', artist: 'The Beach Boys', album: 'Smiley Smile', duration_seconds: 217, genre: 'Pop' },
  { title: 'Born to Run', artist: 'Bruce Springsteen', album: 'Born to Run', duration_seconds: 270, genre: 'Rock' },
  { title: 'Bridge Over Troubled Water', artist: 'Simon & Garfunkel', album: 'Bridge Over Troubled Water', duration_seconds: 295, genre: 'Folk' },
  { title: 'Respect', artist: 'Aretha Franklin', album: 'I Never Loved a Man', duration_seconds: 147, genre: 'Soul' },
  { title: 'Hey Jude', artist: 'The Beatles', album: 'The Beatles 1967-1970', duration_seconds: 431, genre: 'Pop' },
  { title: 'Smells Like Teen Spirit', artist: 'Nirvana', album: 'Nevermind', duration_seconds: 301, genre: 'Grunge' },
  { title: 'Losing My Religion', artist: 'R.E.M.', album: 'Out of Time', duration_seconds: 269, genre: 'Alternative' },
  { title: 'My Generation', artist: 'The Who', album: 'The Who Sings My Generation', duration_seconds: 195, genre: 'Rock' },
  { title: 'A Change Is Gonna Come', artist: 'Sam Cooke', album: 'Ain\'t That Good News', duration_seconds: 192, genre: 'Soul' },
  { title: 'Blue Suede Shoes', artist: 'Elvis Presley', album: 'Elvis Presley', duration_seconds: 120, genre: 'Rock and Roll' },
  { title: 'Waterloo Sunset', artist: 'The Kinks', album: 'Something Else by The Kinks', duration_seconds: 214, genre: 'Rock' },
  { title: 'Midnight Train to Georgia', artist: 'Gladys Knight & the Pips', album: 'Imagination', duration_seconds: 278, genre: 'Soul' },
  { title: 'Take Five', artist: 'Dave Brubeck Quartet', album: 'Time Out', duration_seconds: 324, genre: 'Jazz' },
  { title: 'Clair de Lune', artist: 'Claude Debussy', album: 'Suite Bergamasque', duration_seconds: 300, genre: 'Classical' },
  { title: 'The Girl from Ipanema', artist: 'Stan Getz & João Gilberto', album: 'Getz/Gilberto', duration_seconds: 325, genre: 'Bossa Nova' },
  { title: 'Autumn Leaves', artist: 'Miles Davis', album: 'Somethin\' Else', duration_seconds: 623, genre: 'Jazz' },
  { title: 'Giant Steps', artist: 'John Coltrane', album: 'Giant Steps', duration_seconds: 287, genre: 'Jazz' },
  { title: 'One More Time', artist: 'Daft Punk', album: 'Discovery', duration_seconds: 320, genre: 'Electronic' },
  { title: 'Around the World', artist: 'Daft Punk', album: 'Homework', duration_seconds: 429, genre: 'Electronic' },
  { title: 'Blue Monday', artist: 'New Order', album: 'Power, Corruption & Lies', duration_seconds: 463, genre: 'Electronic' },
  { title: 'Born Slippy', artist: 'Underworld', album: 'Second Toughest in the Infants', duration_seconds: 569, genre: 'Electronic' },
  { title: 'Windowlicker', artist: 'Aphex Twin', album: 'Windowlicker', duration_seconds: 360, genre: 'Electronic' },
  { title: 'Oxygène IV', artist: 'Jean-Michel Jarre', album: 'Oxygène', duration_seconds: 244, genre: 'Electronic' },
  { title: 'Kraftwerk', artist: 'Trans-Europe Express', album: 'Trans-Europe Express', duration_seconds: 383, genre: 'Electronic' },
  { title: 'Personal Jesus', artist: 'Depeche Mode', album: 'Violator', duration_seconds: 223, genre: 'Electronic' },
  { title: 'Sweet Dreams', artist: 'Eurythmics', album: 'Sweet Dreams', duration_seconds: 216, genre: 'Pop' },
  { title: 'Don\'t Stop Believin\'', artist: 'Journey', album: 'Escape', duration_seconds: 251, genre: 'Rock' },
  { title: 'Tainted Love', artist: 'Soft Cell', album: 'Non-Stop Erotic Cabaret', duration_seconds: 152, genre: 'Synth-pop' },
  { title: 'Blue Eyes', artist: 'Elton John', album: 'Jump Up!', duration_seconds: 209, genre: 'Pop' }
];

const playlistItems = [
  { track_index: 0, position: 1.0, votes: 8, added_by: 'Alice', is_playing: true },
  { track_index: 1, position: 2.0, votes: 5, added_by: 'Bob' },
  { track_index: 2, position: 3.0, votes: 3, added_by: 'Charlie' },
  { track_index: 3, position: 4.0, votes: 7, added_by: 'Diana' },
  { track_index: 4, position: 5.0, votes: -1, added_by: 'Eve' },
  { track_index: 10, position: 6.0, votes: 2, added_by: 'Frank' },
  { track_index: 15, position: 7.0, votes: 4, added_by: 'Grace' },
  { track_index: 20, position: 8.0, votes: 0, added_by: 'Henry' },
  { track_index: 25, position: 9.0, votes: 6, added_by: 'Ivy' },
  { track_index: 30, position: 10.0, votes: -2, added_by: 'Jack' }
];

async function main() {
  console.log('🎵 Loading demo songs for SyncPlay...');

  // Check if database is already seeded
  const existingTracks = await prisma.track.count();
  
  if (existingTracks > 0) {
    console.log(`✅ Database already contains ${existingTracks} tracks, skipping seed.`);
    console.log('💡 Set SEED_DATABASE=true to force re-seed, or delete database to start fresh.');
    return;
  }

  // Clean slate for seeding
  await prisma.playlistTrack.deleteMany();
  await prisma.track.deleteMany();

  console.log(`📀 Creating ${tracks.length} demo tracks...`);
  const createdTracks: any[] = [];
  for (const track of tracks) {
    const created = await prisma.track.create({
      data: track,
    });
    createdTracks.push(created);
    console.log(`   ♪ ${track.title} by ${track.artist}`);
  }

  console.log(`🎶 Setting up sample playlist with ${playlistItems.length} tracks...`);
  for (const item of playlistItems) {
    const track = createdTracks[item.track_index];
    await prisma.playlistTrack.create({
      data: {
        track_id: track.id,
        position: item.position,
        votes: item.votes,
        added_by: item.added_by,
        is_playing: item.is_playing || false,
      },
    });
    
    const status = item.is_playing ? '▶️ Now Playing' : `👍 ${item.votes} votes`;
    console.log(`   ${item.position}. ${track.title} - ${status}`);
  }

  console.log('');
  console.log('🎉 Demo database seeded successfully!');
  console.log('🌐 Visit http://localhost:3001 to start collaborating!');
  console.log('🎵 Featured tracks include:');
  console.log('   • Bohemian Rhapsody - Queen');
  console.log('   • Billie Jean - Michael Jackson'); 
  console.log('   • Hotel California - Eagles');
  console.log('   • Imagine - John Lennon');
  console.log('   • Stairway to Heaven - Led Zeppelin');
  console.log('   ...and many more!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });