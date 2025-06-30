import React, { useEffect, useState } from 'react';
import { createAvatar } from '@dicebear/core';
import { avatarTypes } from '../utilities/utility';

const BearAvatar = ({ seed = 'default', type = 'rings', size = 48 }) => {
    const [avatarSvg, setAvatarSvg] = useState(null);

    useEffect(() => {
        if (type && avatarTypes[type]) {
            const generatedAvatar = createAvatar(avatarTypes[type], {
                seed,
                rowColor: ['4285f4', 'ea4335', 'fbbc05', '34a853', '673ab7', '000000'],
                shape1Color: ['4285f4', 'ea4335', 'fbbc05', '34a853', '673ab7', '000000'],
                shape2Color: ['4285f4', 'ea4335', 'fbbc05', '34a853', '673ab7', '000000'],
                ringColor: ['4285f4', 'ea4335', 'fbbc05', '34a853', '673ab7', '000000'],
                backgroundColor: ['4285f4', 'ea4335', 'fbbc05', '34a853', '673ab7', '000000']
            });

            const svgString = generatedAvatar.toString();
            const svgDataUri = `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
            setAvatarSvg(svgDataUri);
        }
    }, [seed, type]);

    if (!avatarSvg) return null;

    return (
        <img
            src={avatarSvg}
            alt="Avatar"
            width={size}
            height={size}
            className="rounded-full object-cover border-2 border-black"
        />
    );
};

export default BearAvatar;
