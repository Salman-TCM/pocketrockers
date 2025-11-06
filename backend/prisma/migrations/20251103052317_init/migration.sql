-- CreateTable
CREATE TABLE "tracks" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "album" TEXT NOT NULL,
    "duration_seconds" INTEGER NOT NULL,
    "genre" TEXT NOT NULL,
    "cover_url" TEXT
);

-- CreateTable
CREATE TABLE "playlist_tracks" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "track_id" TEXT NOT NULL,
    "position" REAL NOT NULL,
    "votes" INTEGER NOT NULL DEFAULT 0,
    "added_by" TEXT NOT NULL,
    "added_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_playing" BOOLEAN NOT NULL DEFAULT false,
    "played_at" DATETIME,
    CONSTRAINT "playlist_tracks_track_id_fkey" FOREIGN KEY ("track_id") REFERENCES "tracks" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "playlist_tracks_track_id_key" ON "playlist_tracks"("track_id");
