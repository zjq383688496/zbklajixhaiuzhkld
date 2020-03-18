module.exports = {
	baseUrl: '/interactive-box-manager',
	fnAutoMallId: AddMallId
}

function AddMallId(cfg = {}) {
	var mallId = uif && uif.userInfo? (uif.userInfo.mallMid || ''): ''
	if (mallId) cfg.mallId = mallId
	return cfg
}