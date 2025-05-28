import { relations } from "drizzle-orm";
import {  integer, pgEnum, pgTable, text, time, timestamp, uuid } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: uuid('id').defaultRandom().primaryKey(),
});

export const usersTableRelations = relations(usersTable, ({ many }) => ({
  usersToClinics: many(usersToClinicsTable),
}));

export const clinicsTabel = pgTable('clinics',{
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()),
});

export const usersToClinicsTable = pgTable('users_to_clinics', {
  userId: uuid('user_id').references(() => usersTable.id, { onDelete: 'cascade' }),
  clinicId: uuid('clinic_id').references(() => clinicsTabel.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()),
});

export const usersToClinicsTableRelations = relations(usersToClinicsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [usersToClinicsTable.userId],
    references: [usersTable.id],
  }),
  clinic: one(clinicsTabel, {
    fields: [usersToClinicsTable.clinicId],
    references: [clinicsTabel.id],
  }),
}));

export const clinicsTableRelations = relations(clinicsTabel, ({ many }) => ({
  doctors: many(doctorsTable),
  patients: many(patientsTable),
  appointments: many(appointmentsTable),
  usersToClinics: many(usersToClinicsTable),
}));

export const doctorsTable = pgTable('doctors',{
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  clinicId: uuid('clinic_id').references(() => clinicsTabel.id, { onDelete: 'cascade' }),
  avatarImageUrl: text('avatar_image_url'),
  // 1- Monday, 2- Tuesday, 3- Wednesday, 4- Thursday, 5- Friday, 6- Saturday, 0- Sunday
  avaliableFromWeekDay: integer('avaliable_from_week_day').notNull(),
  avaliableToWeekDay: integer('avaliable_to_week_day').notNull(),
  avaliableFromTime: time('avaliable_from_time').notNull(),
  avaliableToTime: time('avaliable_to_time').notNull(),
  speciality: text('speciality').notNull(),
  appoitmentsPriceInCents: integer('appoitments_price_in_cents').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()),
});

export const doctorsTableRelations = relations(doctorsTable, ({ many,one }) => ({
  clinic: one(clinicsTabel, {
    fields: [doctorsTable.clinicId],
    references: [clinicsTabel.id],
  }),
  appointments: many(appointmentsTable),
}));

// enum
export const patitentSexEnum = pgEnum('patitents_sex', ['male', 'female']);

export const patientsTable = pgTable('patients',{
  id: uuid('id').defaultRandom().primaryKey(),
  clinicId: uuid('clinic_id').references(() => clinicsTabel.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phoneNumber: text('phone_number').notNull(),
  sex: patitentSexEnum('sex').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()),
});

export const patientsTableRelations = relations(patientsTable, ({ one }) => ({
  clinic: one(clinicsTabel, {
    fields: [patientsTable.clinicId],
    references: [clinicsTabel.id],
  }),
}));

export const appointmentsTable = pgTable('appointments',{
  id: uuid('id').defaultRandom().primaryKey(),
  date: timestamp('date').notNull(),
  clinicId: uuid('clinic_id').references(() => clinicsTabel.id, { onDelete: 'cascade' }),
  patientId: uuid('patient_id').references(() => patientsTable.id, { onDelete: 'cascade' }),
  doctorId: uuid('doctor_id').references(() => doctorsTable.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()),
})

export const appointmentsTableRelations = relations(appointmentsTable, ({ one }) => ({
  clinic: one(clinicsTabel, {
    fields: [appointmentsTable.clinicId],
    references: [clinicsTabel.id],
  }),
  patient: one(patientsTable, {
    fields: [appointmentsTable.patientId],
    references: [patientsTable.id],
  }),
  doctor: one(doctorsTable, {
    fields: [appointmentsTable.doctorId],
    references: [doctorsTable.id],
  }),
}));