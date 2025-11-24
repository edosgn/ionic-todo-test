#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

module.exports = function(ctx) {
    // Only run for iOS platform
    if (ctx.opts.platforms && ctx.opts.platforms.indexOf('ios') > -1) {
        const podfilePath = path.join(ctx.opts.projectRoot, 'platforms', 'ios', 'Podfile');
        
        if (fs.existsSync(podfilePath)) {
            let podfileContent = fs.readFileSync(podfilePath, 'utf8');
            
            // Add post_install hook if it doesn't exist
            const postInstallHook = `
post_install do |installer|
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |config|
      config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '13.0'
    end
  end
end`;

            if (!podfileContent.includes('post_install')) {
                podfileContent += postInstallHook;
                fs.writeFileSync(podfilePath, podfileContent, 'utf8');
                console.log('✅ Added post_install hook to Podfile');
            }
        }
    }
};