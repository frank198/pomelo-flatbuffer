const tc = {};
tc.ItemDistances = {
	itemDistances : [
		{
			linkId   : 'playerRole_3a82c8d04b6111e7b14757060500f1e9口PropertyInfo',
			distance : '10'
		},
		{
			linkId   : 'playerRole_3a82c8d04b6111e7b14757060500f1e9口Watch',
			distance : '100'
		}
	]
};

tc.LoginUserInfo = {
	uuid:'this is uuid',
	playerRoleId:'playerRoleId_123ter',
	gameElement:{gameElementSettingKey:'default'},
	alert:''
};

tc.MessageBoxInfo = {
	"moduleKey": "RoleInfoBox",
	viewOpenLinkId:"RoleInfoBox_test",
	"messageItemList": [
		{
			"propertyValue": "『无名之辈』",
			"linkProperties": [],
			"key": "title"
		},
		{
			"propertyValue": "<obs type=white>你</obs>",
			"linkProperties": [],
			"key": "relation"
		},
		{
			"propertyValue": "",
			"linkProperties": [],
			"key": "name"
		},
		{
			"propertyValue": "<obs type=itemWhite>新进玩家</obs><obs type=itemGray>#3568</obs>",
			"linkProperties": [],
			"key": "nameAndId"
		},
		{
			"propertyValue": "等级 <obs type=white>5</obs>",
			"linkProperties": [],
			"key": "level"
		},
		{
			"propertyValue": "<obs type=drama>你查看自己，只见他身形纤长，略显瘦弱，满头银发，一口大金牙，脸上布满皱纹，拇指是金色的，头上左眼的瞳仁是红色，右臂上的胳膊上的右手不知被什么东西砍去了。身穿，看起来雌雄难辨，容貌可怖，难以直视。</obs>",
			"linkProperties": [],
			"key": "describe"
		},
		{
			"propertyValue": "加血Buff{playerRole_3a82c8d04b6111e7b14757060500f1e9口delayLink}",
			"linkProperties": [
				{
					"linkId":"playerRole_3a82c8d04b6111e7b14757060500f1e9口delayLink",
					"linkContent": "<obs type=default></obs>",
					"unitFormat": "<obs type=count>[{2}{0}{1}]</obs>",
					"units": [
						"秒剩余",
						""
					]
				}
			],
			"key": "buffList"
		},
		{
			"propertyValue": "状态",
			"linkProperties": [],
			"key": "buffTitle"
		}
	],
	"buttonItemList": [
		{
			"key": "property",
			"linkId": "playerRole_3a82c8d04b6111e7b14757060500f1e9口PropertyInfo",
			"buttonTitle": "属性详细",
			"isClose": false
		}
	]
};

module.exports = tc;