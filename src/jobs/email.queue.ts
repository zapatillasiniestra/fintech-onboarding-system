import {EmailJob} from "../types/application";

const jobs: EmailJob[] = [];

export function addEmailJob(job: EmailJob) {
  jobs.push(job);
}

export function getNextJob(): EmailJob | undefined {
  return jobs.shift();
}
