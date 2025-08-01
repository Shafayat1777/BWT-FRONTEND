import useProfile from '@/hooks/useProfile';

import AttendanceTable from './attendance-table';
import FieldVisit from './field-visit';
import LateEntries from './late-entries';
import ManualEntry from './manual-entry';
import PunchLogs from './punch-logs';
import Summary from './summary';
import WorkHoursChart from './work-hours-chart';

const AttendanceReport = () => {
	const { profileData, isLoading } = useProfile();

	if (isLoading) return <div>Loading...</div>;

	return (
		<div className='h-full space-y-6 overflow-auto'>
			<WorkHoursChart employeeId={profileData?.uuid as string} />
			<AttendanceTable employeeId={profileData?.uuid as string} />
			<LateEntries employeeId={profileData?.uuid as string} />
			<Summary employeeId={profileData?.uuid as string} />
			<PunchLogs employeeId={profileData?.uuid as string} />
			<FieldVisit employeeId={profileData?.uuid as string} />
			<ManualEntry employeeId={profileData?.uuid as string} />
		</div>
	);
};

export default AttendanceReport;
