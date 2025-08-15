// Static deployment starter
process.env.STATIC_DEPLOY = 'true';
process.env.NODE_ENV = 'production';

import('./server/index.ts');