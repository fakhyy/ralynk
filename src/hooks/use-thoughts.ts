"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getThoughts,
  getThought,
  createThought,
  updateThought,
  deleteThought,
  searchThoughts,
} from "@/server/actions/thought";

export function useThoughts() {
  return useQuery({
    queryKey: ["thoughts"],
    queryFn: () => getThoughts(),
  });
}

export function useThought(id: string) {
  return useQuery({
    queryKey: ["thought", id],
    queryFn: () => getThought(id),
    enabled: !!id,
  });
}

export function useCreateThought() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createThought,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["thoughts"] });
    },
  });
}

type UpdateThoughtData = Parameters<typeof updateThought>[1];

export function useUpdateThought() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & UpdateThoughtData) =>
      updateThought(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["thoughts"] });
      queryClient.invalidateQueries({ queryKey: ["thought", variables.id] });
    },
  });
}

export function useDeleteThought() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteThought,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["thoughts"] });
    },
  });
}

export function useSearchThoughts(query: string) {
  return useQuery({
    queryKey: ["search", query],
    queryFn: () => searchThoughts(query),
    enabled: query.trim().length > 0,
  });
}
