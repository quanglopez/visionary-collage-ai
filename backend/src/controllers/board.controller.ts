import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const createBoardSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

const updateBoardSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  isPublic: z.boolean().optional(),
});

export const createBoard = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { name, description, tags } = createBoardSchema.parse(req.body);

    const board = await prisma.visionBoard.create({
      data: {
        name,
        description,
        userId,
        tags: {
          connectOrCreate: tags?.map(tag => ({
            where: { name: tag },
            create: { name: tag },
          })) || [],
        },
      },
      include: {
        tags: true,
        collages: {
          include: {
            images: {
              include: {
                image: true,
              },
            },
          },
        },
      },
    });

    res.status(201).json(board);
  } catch (error) {
    console.error('Create board error:', error);
    res.status(400).json({ message: 'Invalid input data' });
  }
};

export const getBoards = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const boards = await prisma.visionBoard.findMany({
      where: { userId },
      include: {
        tags: true,
        collages: {
          include: {
            images: {
              include: {
                image: true,
              },
            },
          },
        },
      },
    });

    res.json(boards);
  } catch (error) {
    console.error('Get boards error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getBoard = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const board = await prisma.visionBoard.findFirst({
      where: {
        id,
        OR: [
          { userId },
          { isPublic: true },
          { shares: { some: { id: req.query.shareId as string } } },
        ],
      },
      include: {
        tags: true,
        collages: {
          include: {
            images: {
              include: {
                image: true,
              },
            },
          },
        },
      },
    });

    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    res.json(board);
  } catch (error) {
    console.error('Get board error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateBoard = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const updates = updateBoardSchema.parse(req.body);

    const board = await prisma.visionBoard.findFirst({
      where: { id, userId },
    });

    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    const updatedBoard = await prisma.visionBoard.update({
      where: { id },
      data: {
        ...updates,
        tags: updates.tags ? {
          set: [],
          connectOrCreate: updates.tags.map(tag => ({
            where: { name: tag },
            create: { name: tag },
          })),
        } : undefined,
      },
      include: {
        tags: true,
        collages: {
          include: {
            images: {
              include: {
                image: true,
              },
            },
          },
        },
      },
    });

    res.json(updatedBoard);
  } catch (error) {
    console.error('Update board error:', error);
    res.status(400).json({ message: 'Invalid input data' });
  }
};

export const deleteBoard = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const board = await prisma.visionBoard.findFirst({
      where: { id, userId },
    });

    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    await prisma.visionBoard.delete({
      where: { id },
    });

    res.json({ message: 'Board deleted successfully' });
  } catch (error) {
    console.error('Delete board error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const shareBoard = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const { expiresInDays } = req.body;

    const board = await prisma.visionBoard.findFirst({
      where: { id, userId },
    });

    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    const share = await prisma.share.create({
      data: {
        boardId: id,
        expiresAt: expiresInDays
          ? new Date(Date.now() + expiresInDays * 86400000)
          : null,
      },
    });

    res.json({
      shareUrl: `${process.env.FRONTEND_URL}/share/${share.id}`,
      expiresAt: share.expiresAt,
    });
  } catch (error) {
    console.error('Share board error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
