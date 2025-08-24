import useTQuery from '@/hooks/useTQuery';

import otherQK from './query-keys';

//* GET OTHER HR
export const useOtherHR = <T>() =>
	useTQuery<T>({
		queryKey: otherQK.hr(),
		url: `/other/hr/value/label`,
	});

//* GET OTHER DEPARTMENT
export const useOtherDepartment = <T>() =>
	useTQuery<T>({
		queryKey: otherQK.department(),
		url: `/other/hr/department/value/label`,
	});

//* GET OTHER SUB DEPARTMENT
export const useOtherSubDepartment = <T>() =>
	useTQuery<T>({
		queryKey: otherQK.subDepartment(),
		url: `/other/hr/sub-department/value/label`,
	});

//* GET OTHER Designation
export const useOtherDesignation = <T>() =>
	useTQuery<T>({
		queryKey: otherQK.designation(),
		url: `/other/hr/designation/value/label`,
	});

//* GET OTHER GROUP
export const useOtherGroup = <T>() =>
	useTQuery<T>({
		queryKey: otherQK.group(),
		url: `/other/store/group/value/label`,
	});

//* GET OTHER BRAND
export const useOtherBrand = <T>() =>
	useTQuery<T>({
		queryKey: otherQK.brand(),
		url: `/other/store/brand/value/label`,
	});

//* GET OTHER MODEL
export const useOtherModel = <T>() =>
	useTQuery<T>({
		queryKey: otherQK.model(),
		url: `/other/store/model/value/label`,
	});

export const useOtherModelByQuery = <T>(query: string) =>
	useTQuery<T>({
		queryKey: otherQK.modelByQuery(query),
		url: `/other/store/model/value/label?${query}`,
	});

//* GET OTHER SIZE
export const useOtherSize = <T>() =>
	useTQuery<T>({
		queryKey: otherQK.size(),
		url: `/other/store/size/value/label`,
	});

//* GET OTHER CATEGORY
export const useOtherCategory = <T>() =>
	useTQuery<T>({
		queryKey: otherQK.category(),
		url: `/other/store/category/value/label`,
	});

//* GET OTHER PRODUCT
export const useOtherProduct = <T>(query?: string) =>
	useTQuery<T>({
		queryKey: otherQK.product(),
		url: query ? `/other/store/product/value/label${query}` : `/other/store/product/value/label`,
	});

//* GET OTHER VENDOR
export const useOtherVendor = <T>() =>
	useTQuery<T>({
		queryKey: otherQK.vendor(),
		url: `/other/store/vendor/value/label`,
	});

//* GET OTHER STOCK
export const useOtherStock = <T>() =>
	useTQuery<T>({
		queryKey: otherQK.stock(),
		url: `/other/store/stock/value/label`,
	});

//* GET OTHER BRANCH
export const useOtherBranch = <T>() =>
	useTQuery<T>({
		queryKey: otherQK.branch(),
		url: `/other/store/branch/value/label`,
	});

//* GET OTHER PURCHASE
export const useOtherPurchase = <T>() =>
	useTQuery<T>({
		queryKey: otherQK.purchase(),
		url: `/other/store/purchase/value/label`,
	});

//* GET OTHER WAREHOUSE
export const useOtherWarehouse = <T>() =>
	useTQuery<T>({
		queryKey: otherQK.warehouse(),
		url: `/other/store/warehouse/value/label`,
	});
export const useOtherWarehouseByQuery = <T>(query: string) =>
	useTQuery<T>({
		queryKey: otherQK.warehouseByQuery(query),
		url: `/other/store/warehouse/value/label?${query}`,
	});

//* GET OTHER ROOM
export const useOtherRoom = <T>() =>
	useTQuery<T>({
		queryKey: otherQK.room(),
		url: `/other/store/room/value/label`,
	});

//* GET OTHER RACK
export const useOtherRack = <T>() =>
	useTQuery<T>({
		queryKey: otherQK.rack(),
		url: `/other/store/rack/value/label`,
	});

//* GET OTHER FLOOR
export const useOtherFloor = <T>() =>
	useTQuery<T>({
		queryKey: otherQK.floor(),
		url: `/other/store/floor/value/label`,
	});

//* GET OTHER BOX
export const useOtherBox = <T>() =>
	useTQuery<T>({
		queryKey: otherQK.box(),
		url: `/other/store/box/value/label`,
	});

//* GET OTHER PROBLEM
export const useOtherProblem = <T>(query: string) =>
	useTQuery<T>({
		queryKey: otherQK.problem(query),
		url: `/other/work/problem/value/label?category=${query}`,
	});
//* GET OTHER SECTION
export const useOtherSection = <T>() =>
	useTQuery<T>({
		queryKey: otherQK.section(),
		url: `/other/work/section/value/label`,
	});

//* GET OTHER USER
export const useOtherUser = <T>() =>
	useTQuery<T>({
		queryKey: otherQK.user(),
		url: `/other/hr/users/value/label`,
	});
export const useOtherUserByQuery = <T>(query: string) =>
	useTQuery<T>({
		queryKey: otherQK.userByQuery(query),
		url: `/other/hr/users/value/label${query}`,
	});
//* GET OTHER VEHICLE
export const useOtherVehicle = <T>() =>
	useTQuery<T>({
		queryKey: otherQK.vehicle(),
		url: `/other/delivery/vehicle/value/label`,
	});
//* GET OTHER COURIER
export const useOtherCourier = <T>() =>
	useTQuery<T>({
		queryKey: otherQK.courier(),
		url: `/other/delivery/courier/value/label`,
	});

//* GET OTHER ORDER
export const useOtherOrder = <T>(query?: string) =>
	useTQuery<T>({
		queryKey: otherQK.order(),
		url: query ? `/other/work/order/value/label?${query}` : `/other/work/order/value/label`,
	});
//* GET OTHER Accessories
export const useOtherAccessories = <T>() =>
	useTQuery<T>({
		queryKey: otherQK.accessories(),
		url: `/other/work/accessory/value/label`,
	});

//* GET OTHER ZONE
export const useOtherZone = <T>() =>
	useTQuery<T>({
		queryKey: otherQK.zone(),
		url: `/other/work/zone/value/label`,
	});

//* GET OTHER WORKPLACE
export const useOtherWorkplace = <T>() =>
	useTQuery<T>({
		queryKey: otherQK.workPlace(),
		url: `/other/hr/workplace/value/label`,
	});

//* GET OTHER EMPLOYMENT TYPE
export const useOtherEmploymentType = <T>() =>
	useTQuery<T>({
		queryKey: otherQK.employmentType(),
		url: `/other/hr/employment-type/value/label`,
	});

//* GET OTHER SHIFT GROUP
export const useOtherShiftGroup = <T>() =>
	useTQuery<T>({
		queryKey: otherQK.shiftGroup(),
		url: `/other/hr/shift-group/value/label`,
	});

//* GET OTHER LEAVE POLICY
export const useOtherLeavePolicy = <T>(query?: string) =>
	useTQuery<T>({
		queryKey: otherQK.leavePolicy(query),
		url: query ? `/other/hr/leave-policy/value/label?${query}` : `/other/hr/leave-policy/value/label`,
	});

//* GET OTHER LEAVE EMPLOYEE
export const useOtherEmployees = <T>(query?: string) =>
	useTQuery<T>({
		queryKey: otherQK.employees(query),
		url: query ? `/other/hr/employee/value/label?${query}` : `/other/hr/employee/value/label`,
		enabled: query ? !!query : true,
	});
//* GET OTHER LEAVE CATEGORY
export const useOtherLeaveCategory = <T>(query?: string) =>
	useTQuery<T>({
		queryKey: otherQK.leaveCategory(query),
		url: query ? `/other/hr/leave-category/value/label?${query}` : `/other/hr/leave-category/value/label`,
		enabled: query ? !!query : true,
	});

//* GET OTHER DEVICE LIST
export const useOtherDeviceList = <T>(query?: string) =>
	useTQuery<T>({
		queryKey: otherQK.deviceList(),
		url: `${query ? `/other/hr/device-list/value/label?${query}` : `/other/hr/device-list/value/label`}`,
		enabled: query ? !!query : true,
	});
//* GET OTHER SHIFTS
export const useOtherShifts = <T>(query?: string) =>
	useTQuery<T>({
		queryKey: otherQK.shifts(query),
		url: `${query ? `/other/hr/shifts/value/label?${query}` : `/other/hr/shifts/value/label`}`,
		enabled: query ? !!query : true,
	});
//* GET OTHER ROASTER
export const useOtherRoaster = <T>(query?: string) =>
	useTQuery<T>({
		queryKey: otherQK.roaster(query),
		url: `${query ? `/other/hr/roaster/value/label?${query}` : `/other/hr/roaster/value/label`}`,
		enabled: query ? !!query : true,
	});

//* GET OTHER LINE MANAGERS
export const useOtherLineManager = <T>() =>
	useTQuery<T>({
		queryKey: otherQK.lineManager(),
		url: `/other/hr/employee/value/label?is_line_manager=true`,
	});

//* GET OTHER HR MANAGERS
export const useOtherHrManager = <T>() =>
	useTQuery<T>({
		queryKey: otherQK.hrManager(),
		url: `/other/hr/employee/value/label?is_hr=true`,
	});
//* GET OTHER PURCHASE ENTRY
export const useOtherPurchaseEntry = <T>(query?: string) =>
	useTQuery<T>({
		queryKey: otherQK.purchaseEntry(query),
		url: query ? `/other/store/purchase-entry/value/label?${query}` : `/other/store/purchase-entry/value/label`,
	});

//* GET OTHER ATTRIBUTES
export const useOtherAttributes = <T>(query?: string) =>
	useTQuery<T>({
		queryKey: otherQK.attributes(query),
		url: query
			? `/other/store/product-attributes/value/label?${query}`
			: `/other/store/product-attributes/value/label`,
	});
