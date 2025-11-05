'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { DragDropContext, DropResult } from '@hello-pangea/dnd'
import { usePlaylistStore } from '@/store/playlist-store'
import { useUpdatePlaylistTrack } from '@/hooks/use-api'
import { useState } from 'react'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

function DragDropProvider({ children }: { children: React.ReactNode }) {
  const { playlist } = usePlaylistStore()
  const updateTrackMutation = useUpdatePlaylistTrack()

  const handleDragEnd = (result: DropResult) => {
    console.log('Drag ended:', result)
    
    if (!result.destination) {
      console.log('No destination, aborting')
      return
    }

    const { source, destination, draggableId } = result

    if (source.index === destination.index) {
      console.log('Same position, aborting')
      return
    }

    console.log(`Moving track ${draggableId} from ${source.index} to ${destination.index}`)

    // Calculate new position between adjacent items
    const sortedPlaylist = [...playlist].sort((a, b) => a.position - b.position)
    const draggedItem = sortedPlaylist.find(item => item.id === draggableId)
    
    if (!draggedItem) {
      console.log('Dragged item not found')
      return
    }

    let newPosition: number

    if (destination.index === 0) {
      // Moving to top
      newPosition = sortedPlaylist[0].position / 2
    } else if (destination.index === sortedPlaylist.length - 1) {
      // Moving to bottom
      newPosition = sortedPlaylist[sortedPlaylist.length - 1].position + 1000
    } else {
      // Moving between items
      const prevItem = sortedPlaylist[destination.index - 1]
      const nextItem = sortedPlaylist[destination.index]
      newPosition = (prevItem.position + nextItem.position) / 2
    }

    console.log('New position calculated:', newPosition, 'for track:', draggedItem.track.title)

    // Optimistic update in store
    usePlaylistStore.getState().updatePlaylistItem(draggedItem.id, { position: newPosition })

    // Update server
    updateTrackMutation.mutate({
      id: draggableId,
      data: { position: newPosition }
    })
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      {children}
    </DragDropContext>
  )
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <DragDropProvider>
        {children}
      </DragDropProvider>
    </QueryClientProvider>
  )
}