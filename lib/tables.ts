import "server-only";
import { schema } from "./db";
import type { ResourceKey } from "./resources";

export const TABLES = {
  posts: schema.posts,
  events: schema.events,
  gallery: schema.galleryItems,
  videos: schema.videos,
  teachers: schema.teachers,
  students: schema.students,
  leaders: schema.leaders,
  testimonials: schema.testimonials,
  messages: schema.messages,
  registrations: schema.registrations,
  dana: schema.danaBookings,
  users: schema.users,
} satisfies Record<ResourceKey, unknown>;
