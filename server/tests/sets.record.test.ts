import { SetRecord } from "../records/sets";
import { connectDB } from "../database/connections/mainDatabase";
import mongoose from "mongoose";
import { ValidationError } from "../errors/error";

let connection: mongoose.Connection;

beforeAll(async () => {
  connection = await connectDB();
});

afterAll(async () => {
  await connection.close();
});

const defaultSet = {
  _id: "1234",
  name: "Test Set",
  description: "A test set",
  createdAt: new Date(),
  words: [
    { _id: "1", word: "test", meaning: "A trial or experiment" },
    {
      _id: "2",
      word: "example",
      meaning:
        "A thing characteristic of its kind or illustrating a general rule.",
    },
  ],
  __v: 0,
};

test("Can build AnnouncementRecord", () => {
  const set = new SetRecord({
    ...defaultSet,
  });
  expect(set.name).toBe("Test Set");
  expect(set.description).toBe("A test set");
  expect(set.words).toEqual([
    { _id: "1", word: "test", meaning: "A trial or experiment" },
    {
      _id: "2",
      word: "example",
      meaning:
        "A thing characteristic of its kind or illustrating a general rule.",
    },
  ]);
});
test("Creating SetRecord with empty name throws an error", () => {
  expect(
    () =>
      new SetRecord({
        ...defaultSet,
        name: "",
      })
  ).toThrowError(ValidationError);
});

test("Creating SetRecord with name longer than 100 characters throws an error", () => {
  const longName = "a".repeat(101);
  expect(
    () =>
      new SetRecord({
        ...defaultSet,
        name: longName,
      })
  ).toThrowError(ValidationError);
});

test("Creating SetRecord with description longer than 1000 characters throws an error", () => {
  const longDescription = "a".repeat(1001);
  expect(
    () =>
      new SetRecord({
        ...defaultSet,
        description: longDescription,
      })
  ).toThrowError(ValidationError);
});

test("Creating SetRecord with empty set of words throws an error", () => {
  expect(
    () =>
      new SetRecord({
        ...defaultSet,
        words: [],
      })
  ).toThrowError(ValidationError);
});

test("Creating SetRecord with valid data creates the record", () => {
  const set = new SetRecord({
    ...defaultSet,
  });
  expect(set).toBeInstanceOf(SetRecord);
});

// test("Finding a set by ID returns the correct set", async () => {
//   const set = await SetRecord.findOne(defaultSet._id);
//   expect(set).toBeInstanceOf(SetRecord);
//   expect(set._id).toBe(defaultSet._id);
// });

test("Finding all sets returns an array of SetRecord instances", async () => {
  const sets = await SetRecord.findAll();
  expect(sets).toBeInstanceOf(Array);
  expect(sets[0]).toBeInstanceOf(SetRecord);
});

test("Finding all sets with a name filter returns the correct sets", async () => {
  const sets = await SetRecord.findAll("Test");
  expect(sets).toBeInstanceOf(Array);
  expect(sets[0]).toBeInstanceOf(SetRecord);
  // expect(sets[0].name).toBe("Test Set");
});

test("Finding all sets with a non-existent name filter returns an empty array", async () => {
  const sets = await SetRecord.findAll("Non-existent name");
  expect(sets).toBeInstanceOf(Array);
  expect(sets).toHaveLength(0);
});