"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new client_1.PrismaClient();
async function main() {
    const u1 = await prisma.user.upsert({
        where: { email: 'a@b.com' },
        update: {},
        create: {
            email: 'a@b.com',
            passwordHash: await bcrypt.hash('pass', 10),
            name: 'A',
            birthday: new Date('1995-05-20')
        }
    });
    const u2 = await prisma.user.upsert({
        where: { email: 'b@b.com' },
        update: {},
        create: {
            email: 'b@b.com',
            passwordHash: await bcrypt.hash('pass', 10),
            name: 'B',
            birthday: new Date('1996-08-12')
        }
    });
    const rel = await prisma.relationship.upsert({
        where: { joinCode: 'demo-rel' },
        update: {},
        create: { joinCode: 'demo-rel' }
    });
    await prisma.relationshipMember.upsert({
        where: { relationshipId_userId: { relationshipId: rel.id, userId: u1.id } },
        update: {},
        create: { relationshipId: rel.id, userId: u1.id }
    });
    await prisma.relationshipMember.upsert({
        where: { relationshipId_userId: { relationshipId: rel.id, userId: u2.id } },
        update: {},
        create: { relationshipId: rel.id, userId: u2.id }
    });
    const unlockHour = Number(process.env.LETTER_UNLOCK_HOUR || 7);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const next = new Date(today);
    next.setDate(today.getDate() + 2);
    const dayUnlock = (d) => {
        const t = new Date(d);
        t.setHours(unlockHour, 0, 0, 0);
        return t;
    };
    await prisma.letter.upsert({
        where: { id: `${rel.id}-l1` },
        update: {},
        create: {
            id: `${rel.id}-l1`,
            relationshipId: rel.id,
            authorId: u1.id,
            content: 'I hope today treats you gently.',
            unlockDate: dayUnlock(today)
        }
    });
    await prisma.letter.upsert({
        where: { id: `${rel.id}-l2` },
        update: {},
        create: {
            id: `${rel.id}-l2`,
            relationshipId: rel.id,
            authorId: u1.id,
            content: 'No matter how busy it gets, I’m thinking of you.',
            unlockDate: dayUnlock(tomorrow)
        }
    });
    await prisma.letter.upsert({
        where: { id: `${rel.id}-l3` },
        update: {},
        create: {
            id: `${rel.id}-l3`,
            relationshipId: rel.id,
            authorId: u1.id,
            content: 'You’ve got me, always.',
            unlockDate: dayUnlock(next)
        }
    });
    const moods = ['GOOD', 'OKAY', 'LOW', 'STRESSED'];
    const responses = {
        GOOD: 'That makes me smile. I’m really happy for you.',
        OKAY: 'Thank you for sharing. I’m here with you.',
        LOW: 'Thank you for telling me. You don’t have to carry everything alone.',
        STRESSED: 'I’m on your side. I believe in you.'
    };
    for (const m of moods) {
        const existing = await prisma.checkInResponse.findFirst({
            where: { relationshipId: rel.id, authorId: u1.id, mood: m }
        });
        if (existing) {
            await prisma.checkInResponse.update({ where: { id: existing.id }, data: { content: responses[m] } });
        }
        else {
            await prisma.checkInResponse.create({
                data: { relationshipId: rel.id, authorId: u1.id, mood: m, content: responses[m] }
            });
        }
    }
    const comforts = [
        'You’re allowed to rest.',
        'I’m on your side. Always.',
        'Nothing about today changes how much you matter to me.'
    ];
    for (const c of comforts) {
        const id = `${rel.id}-${Buffer.from(c).toString('hex').slice(0, 8)}`;
        await prisma.comfortMessage.upsert({
            where: { id },
            update: {},
            create: { id, relationshipId: rel.id, authorId: u1.id, content: c }
        });
    }
    await prisma.message.upsert({
        where: { id: `${rel.id}-m1` },
        update: {},
        create: { id: `${rel.id}-m1`, relationshipId: rel.id, senderId: u1.id, content: 'Hi ❤️', type: 'TEXT' }
    });
    await prisma.message.upsert({
        where: { id: `${rel.id}-m2` },
        update: {},
        create: { id: `${rel.id}-m2`, relationshipId: rel.id, senderId: u2.id, content: '🫶', type: 'EMOJI' }
    });
}
main()
    .then(() => prisma.$disconnect())
    .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});
//# sourceMappingURL=seed.js.map