export const workQK = {
	all: () => ['work'],

	//* problem
	problem: () => [...workQK.all(), 'problem'],
	problemByUUID: (uuid: string) => [...workQK.problem(), uuid],
	//* job
	job: () => [...workQK.all(), 'job'],
	jobByUUID: (uuid: string) => [...workQK.job(), uuid],
	//* section
	section: () => [...workQK.all(), 'section'],
	sectionByUUID: (uuid: string) => [...workQK.section(), uuid],
};
