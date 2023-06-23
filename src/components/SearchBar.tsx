"use client";

import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { Prisma, Subreddit } from "@prisma/client";
import axios from "axios";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/Command";
import { usePathname, useRouter } from "next/navigation";
import { Loader2, Users } from "lucide-react";
import debounce from "lodash.debounce";
import { useOnClickOutside } from "@/hooks/useClickOutside";

const SearchBar = () => {
  const [input, setInput] = useState<string>("");

  const commandRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(commandRef, () => setInput(""));

  const router = useRouter();
  const pathame = usePathname();

  const {
    data: results,
    refetch,
    isFetched,
    isFetching,
  } = useQuery({
    queryKey: ["search-bar"],
    enabled: false,
    queryFn: async () => {
      if (!input) return [];
      const { data } = await axios.get(`/api/search?q=${input}`);
      return data as (Subreddit & {
        _count: Prisma.SubredditCountOutputType;
      })[];
    },
  });

  const request = debounce(async () => {
    refetch();
  }, 300);

  const debounceReq = useCallback(() => {
    request();
  }, []);

  useEffect(() => {
    setInput("");
  }, [pathame]);

  return (
    <Command
      ref={commandRef}
      className="relative rounded-lg border max-w-lg z-50 overflow-visible"
    >
      <CommandInput
        placeholder="Search communities"
        value={input}
        onValueChange={(text) => {
          setInput(text);
          debounceReq();
        }}
        className="outline-none border-none focus:outline-none focus:border-none ring-0"
      />

      {input.length > 0 && (
        <CommandList className="absolute bg-white top-full inset-x-0 shadow rounded-b-md">
          {isFetched && <CommandEmpty>No results found.</CommandEmpty>}

          {isFetching && (
            <div className="py-4 w-full flex items-center justify-center">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
          )}

          {(results?.length ?? 0) > 0 && (
            <CommandGroup heading="Communities">
              {results?.map((subreddit) => (
                <CommandItem
                  key={subreddit.id}
                  value={subreddit.name}
                  onSelect={(e) => {
                    router.push(`/r/${e}`);
                    router.refresh();
                  }}
                >
                  <Users className="mr-2 h-4 w-4" />
                  <a href={`/r/${subreddit.name}`}>r/{subreddit.name}</a>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      )}
    </Command>
  );
};

export default SearchBar;
