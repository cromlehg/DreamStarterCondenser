import extractContent from 'app/utils/ExtractContent';
import { objAccessor } from 'app/utils/Accessors';
import normalizeProfile from 'app/utils/NormalizeProfile';

const site_desc =
    'Dream is a social media platform where everyone gets paid for creating and curating content. It leverages a robust digital points system (Dream) for digital rewards.';

function addSiteMeta(metas) {
    metas.push({ title: 'Dreamit' });
    metas.push({ name: 'description', content: site_desc });
    metas.push({ property: 'og:type', content: 'website' });
    metas.push({ property: 'og:site_name', content: 'Dream' });
    metas.push({ property: 'og:title', content: 'Dream' });
    metas.push({ property: 'og:description', content: site_desc });
    metas.push({
        property: 'og:image',
        content: 'http://dreamvp.com/images/logo-mini.png',
    });
    metas.push({ property: 'fb:app_id', content: $STM_Config.fb_app });
    metas.push({ name: 'twitter:card', content: 'summary' });
    metas.push({ name: 'twitter:site', content: '@dreamreal' });
    metas.push({ name: 'twitter:title', content: '#DreamReal' });
    metas.push({ name: 'twitter:description', site_desc });
    metas.push({
        name: 'twitter:image',
        content: 'http://dreamvp.com/images/logo-mini.png',
    });
}

export default function extractMeta(chain_data, rp) {
    const metas = [];
    if (rp.username && rp.slug) {
        // post
        const post = `${rp.username}/${rp.slug}`;
        const content = chain_data.content[post];
        const author = chain_data.accounts[rp.username];
        const profile = normalizeProfile(author);
        if (content && content.id !== '0.0.0') {
            // API currently returns 'false' data with id 0.0.0 for posts that do not exist
            const d = extractContent(objAccessor, content, false);
            const url = 'http://dreamvp.com' + d.link;
            const title = d.title + ' — Dream';
            const desc = d.desc + ' by ' + d.author;
            const image = d.image_link || profile.profile_image;
            const { category, created } = d;

            // Standard meta
            metas.push({ title });
            metas.push({ canonical: url });
            metas.push({ name: 'description', content: desc });

            // Open Graph data
            metas.push({ name: 'og:title', content: title });
            metas.push({ name: 'og:type', content: 'article' });
            metas.push({ name: 'og:url', content: url });
            metas.push({
                name: 'og:image',
                content: image || 'http://dreamvp.com/images/logo-small.png',
            });
            metas.push({ name: 'og:description', content: desc });
            metas.push({ name: 'og:site_name', content: 'Dream' });
            metas.push({ name: 'fb:app_id', content: $STM_Config.fb_app });
            metas.push({ name: 'article:tag', content: category });
            metas.push({
                name: 'article:published_time',
                content: created,
            });

            // Twitter card data
            metas.push({
                name: 'twitter:card',
                content: image ? 'summary_large_image' : 'summary',
            });
            metas.push({ name: 'twitter:site', content: '@dreamreal' });
            metas.push({ name: 'twitter:title', content: title });
            metas.push({ name: 'twitter:description', content: desc });
            metas.push({
                name: 'twitter:image',
                content:
                    image || 'http://dreamvp.com/images/steemit-twshare-2.png',
            });
        } else {
            addSiteMeta(metas);
        }
    } else if (rp.accountname) {
        // user profile root
        const account = chain_data.accounts[rp.accountname];
        let { name, about, profile_image } = normalizeProfile(account);
        if (name == null) name = account.name;
        if (about == null)
            about =
                'Join thousands on dream who share, dream and earn rewards.';
        if (profile_image == null)
            profile_image = 'http://dreamvp.com/images/steemit-twshare-2.png';
        // Set profile tags
        const title = `@${account.name}`;
        const desc = `The latest posts from ${name}. Follow me at @${
            account.name
        }. ${about}`;
        const image = profile_image;

        // Standard meta
        metas.push({ name: 'description', content: desc });

        // Twitter card data
        metas.push({ name: 'twitter:card', content: 'summary' });
        metas.push({ name: 'twitter:site', content: '@dreamreal' });
        metas.push({ name: 'twitter:title', content: title });
        metas.push({ name: 'twitter:description', content: desc });
        metas.push({ name: 'twitter:image', content: image });
    } else {
        // site
        addSiteMeta(metas);
    }
    return metas;
}
