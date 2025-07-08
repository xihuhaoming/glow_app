/**
 * 数据库初始化云函数
 */

const db = uniCloud.database();
const { 
  initUsers, 
  initSystemConfig, 
  initAnnouncements, 
  initBanners 
} = require('./init-data');

exports.main = async (event, context) => {
  const { force = false } = event;
  
  try {
    console.log('开始初始化数据库...');
    
    // 检查是否已经初始化过
    if (!force) {
      const userCount = await db.collection('users').count();
      if (userCount.total > 0) {
        return {
          errCode: 1001,
          errMsg: '数据库已经初始化过，如需重新初始化请设置force=true'
        };
      }
    }

    // 初始化用户表
    console.log('初始化用户表...');
    if (force) {
      await db.collection('users').where({}).remove();
    }
    for (const user of initUsers) {
      await db.collection('users').add(user);
    }

    // 初始化系统配置表
    console.log('初始化系统配置表...');
    if (force) {
      await db.collection('system_config').where({}).remove();
    }
    for (const config of initSystemConfig) {
      await db.collection('system_config').add(config);
    }

    // 初始化公告表
    console.log('初始化公告表...');
    if (force) {
      await db.collection('announcements').where({}).remove();
    }
    for (const announcement of initAnnouncements) {
      await db.collection('announcements').add(announcement);
    }

    // 初始化轮播图表
    console.log('初始化轮播图表...');
    if (force) {
      await db.collection('banners').where({}).remove();
    }
    for (const banner of initBanners) {
      await db.collection('banners').add(banner);
    }

    console.log('数据库初始化完成！');

    return {
      errCode: 0,
      result: {
        success: true,
        message: '数据库初始化成功',
        statistics: {
          users: initUsers.length,
          systemConfig: initSystemConfig.length,
          announcements: initAnnouncements.length,
          banners: initBanners.length
        }
      }
    };

  } catch (error) {
    console.error('数据库初始化失败:', error);
    return {
      errCode: 500,
      errMsg: '数据库初始化失败: ' + error.message
    };
  }
};