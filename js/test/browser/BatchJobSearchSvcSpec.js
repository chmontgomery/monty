describe("Batch Jobs result sorter", function() {
	var	batchJobSearchSvc,
		jobs;

    beforeEach(module('batchJobs.services'));

    beforeEach(inject(function ($injector) {
        batchJobSearchSvc = $injector.get('batchJobSearchSvc');
    }));

	beforeEach( function() {
		jobs = [
			{jobKey:"AJob1",lastStatus:"SUCCESS"},
			{jobKey:"AJob2",lastStatus:"FAILURE"},
			{jobKey:"AJob3",lastStatus:"MISFIRE"},
			{jobKey:"AJob4",lastStatus:""},
			{jobKey:"BJob1",lastStatus:"MISFIRE"},
			{jobKey:"BJob2",lastStatus:"SUCCESS"},
			{jobKey:"BJob3",lastStatus:""},
			{jobKey:"BJob4",lastStatus:"FAILURE"},
			{jobKey:"CJob1",lastStatus:"FAILURE"},
			{jobKey:"CJob2",lastStatus:""},
			{jobKey:"CJob3",lastStatus:"MISFIRE"},
			{jobKey:"CJob4",lastStatus:"SUCCESS"}];
	});

    it("failed jobs first", inject(function() {
        var sortedJobs = batchJobSearchSvc.sortJobsByStatus(jobs);
        expect(jobs[0].jobKey).toBe("AJob2");
        expect(jobs[0].lastStatus).toBe("FAILURE");
    }));

	it("then unkown statuses", function() {
		var sortedJobs = batchJobSearchSvc.sortJobsByStatus(jobs);
		expect(jobs[4].jobKey).toBe("BJob3");
		expect(jobs[4].lastStatus).toBe("");
	});

	it("then the success statuses", function() {
		var sortedJobs = batchJobSearchSvc.sortJobsByStatus(jobs);
		expect(jobs[8].jobKey).toBe("CJob4");
		expect(jobs[8].lastStatus).toBe("SUCCESS");
	});

	it("lastly the success misfires", function() {
		var sortedJobs = batchJobSearchSvc.sortJobsByStatus(jobs);
		expect(jobs[11].jobKey).toBe("CJob3");
		expect(jobs[11].lastStatus).toBe("MISFIRE");
	});
});