export const storeQK = {
	all: () => ['store'],

	//* group
	group: () => [...storeQK.all(), 'group'],
	groupByUUID: (uuid: string) => [...storeQK.group(), uuid],

	//* category
	category: () => [...storeQK.all(), 'category'],
	categoryByUUID: (uuid: string) => [...storeQK.category(), uuid],

	//* brand
	brand: () => [...storeQK.all(), 'brand'],
	brandByUUID: (uuid: string) => [...storeQK.brand(), uuid],

	//* model
	model: () => [...storeQK.all(), 'model'],
	modelByUUID: (uuid: string) => [...storeQK.model(), uuid],

	//* attribute
	attribute: () => [...storeQK.all(), 'attribute'],
	attributeByUUID: (uuid: string) => [...storeQK.attribute(), uuid],

	//* size
	size: () => [...storeQK.all(), 'size'],
	sizeByUUID: (uuid: string) => [...storeQK.size(), uuid],

	//* vendor
	vendor: () => [...storeQK.all(), 'vendor'],
	vendorByUUID: (uuid: string) => [...storeQK.vendor(), uuid],

	//* product
	product: () => [...storeQK.all(), 'product'],
	productByUUID: (uuid: string) => [...storeQK.product(), uuid],

	//* stock
	stock: () => [...storeQK.all(), 'stock'],
	stockByUUID: (uuid: string) => [...storeQK.stock(), uuid],

	//* branch
	branch: () => [...storeQK.all(), 'branch'],
	branchByUUID: (uuid: string) => [...storeQK.branch(), uuid],

	//* warehouse
	warehouse: () => [...storeQK.all(), 'warehouse'],
	warehouseByUUID: (uuid: string) => [...storeQK.warehouse(), uuid],

	//* Rack
	rack: () => [...storeQK.all(), 'rack'],
	rackByUUID: (uuid: string) => [...storeQK.rack(), uuid],

	//* room
	room: () => [...storeQK.all(), 'room'],
	roomByUUID: (uuid: string) => [...storeQK.room(), uuid],

	//* Floor
	floor: () => [...storeQK.all(), 'floor'],
	floorByUUID: (uuid: string) => [...storeQK.floor(), uuid],

	//* Box
	box: () => [...storeQK.all(), 'box'],
	boxByUUID: (uuid: string) => [...storeQK.box(), uuid],

	//? NEW PRODUCT ENTRY ?//
	//*  Product Entry
	productEntry: () => [...storeQK.all(), 'productEntry'],
	productEntryByUUID: (uuid: string) => [...storeQK.productEntry(), uuid],

	//* Product Specification
	productSpecification: () => [...storeQK.all(), 'productSpecification'],

	//* Product Image
	productImage: () => [...storeQK.all(), 'productImage'],

	//* Product Variant
	productVariant: () => [...storeQK.all(), 'productVariant'],

	//* Product Variant Entry
	productVariantEntry: () => [...storeQK.all(), 'productVariantEntry'],

	//? NEW PRODUCT ENTRY ?//

	//* Purchase
	purchase: () => [...storeQK.all(), 'purchase'],
	purchaseEntry: () => [...storeQK.purchase(), 'purchaseEntry'],
	purchaseByUUID: (uuid: string) => [...storeQK.purchase(), uuid],
	purchaseEntryByUUID: (uuid: string) => [...storeQK.purchaseEntry(), uuid],

	//* Purchase Return
	purchaseReturn: () => [...storeQK.all(), 'purchaseReturn'],
	purchaseReturnEntry: () => [...storeQK.purchaseReturn(), 'purchaseReturnEntry'],
	purchaseReturnByUUID: (uuid: string) => [...storeQK.purchaseReturn(), uuid],
	purchaseReturnEntryByUUID: (uuid: string) => [...storeQK.purchaseReturnEntry(), uuid],

	//* Internal Transfer
	internalTransfer: () => [...storeQK.all(), 'internalTransfer'],
	internalTransferByUUID: (uuid: string) => [...storeQK.internalTransfer(), uuid],

	//* Order Transfer
	orderTransfer: (query?: string) => [...storeQK.all(), 'orderTransfer', query],
	orderTransferByUUID: (uuid: string) => [...storeQK.orderTransfer(), uuid],

	//*BIll Info
	billInfo: () => [...storeQK.all(), 'billInfo'],
	billInfoByUUID: (uuid: string) => [...storeQK.billInfo(), uuid],

	//* Accessories
	accessories: () => [...storeQK.all(), 'accessories'],
	accessoriesByUUID: (uuid: string) => [...storeQK.accessories(), uuid],
	//* Contact Us
	contactUs: () => [...storeQK.all(), 'contactUs'],
	contactUsByUUID: (uuid: number) => [...storeQK.contactUs(), uuid],

	//*Review
	review: () => [...storeQK.all(), 'review'],
	reviewByUUID: (uuid: string) => [...storeQK.review(), uuid],
};
