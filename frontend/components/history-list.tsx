"use client";

import { useHistoryStore } from "@/store/history";
import { Button } from "@/components/ui/button";
import { Trash2, Clock, User, Users } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNetworkFinderStore } from "@/store/network-finder-store";

interface HistoryListProps {
  type: "person" | "icp";
}

export function HistoryList({ type }: HistoryListProps) {
  const { searches, removeSearch, selectSearch } = useHistoryStore();
  const { setResults, setStep } = useNetworkFinderStore();
  const filteredSearches = searches.filter((search) => search.type === type);
  console.log(searches);
  const handleSearchClick = (search: (typeof searches)[0]) => {
    selectSearch(search.id);
    if (search.result) {
      setResults(search.result);
      setStep("results");
    }
  };

  if (filteredSearches.length === 0) {
    return (
      <div className='text-center py-4 text-muted-foreground text-sm'>
        No search history yet
      </div>
    );
  }

  return (
    <div className='space-y-2 max-h-[400px] overflow-y-auto pr-2'>
      {filteredSearches.map((search) => (
        <div
          key={search.id}
          className='flex flex-col p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer'
          onClick={() => handleSearchClick(search)}
        >
          <div className='flex items-center justify-between gap-2'>
            <div className='flex items-center gap-2 min-w-0'>
              {search.result && search.result[0] && (
                <Avatar className='h-8 w-8'>
                  <AvatarImage src={search.result[0].avatar} />
                  <AvatarFallback>
                    <User className='h-4 w-4' />
                  </AvatarFallback>
                </Avatar>
              )}
              <div className='truncate'>
                <p className='text-sm font-medium truncate'>
                  {search.result[0].name}
                </p>
                <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                  <Clock className='h-3 w-3' />
                  {formatDistanceToNow(search.timestamp, { addSuffix: true })}
                  {search.result && (
                    <>
                      <span>•</span>
                      <Users className='h-3 w-3' />
                      {search.result.length} connections
                    </>
                  )}
                </div>
              </div>
            </div>
            <Button
              variant='ghost'
              size='icon'
              className='h-8 w-8 text-muted-foreground hover:text-foreground'
              onClick={(e) => {
                e.stopPropagation();
                removeSearch(search.id);
              }}
            >
              <Trash2 className='h-4 w-4' />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
