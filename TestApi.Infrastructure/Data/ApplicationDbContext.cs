using Microsoft.EntityFrameworkCore;
using TestApi.Domain.Entities;

namespace TestApi.Infrastructure.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Product> Products => Set<Product>();
    public DbSet<User> Users => Set<User>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Stock> Stocks => Set<Stock>();
    public DbSet<Invoice> Invoices => Set<Invoice>();
    public DbSet<InvoiceItem> InvoiceItems => Set<InvoiceItem>();
    public DbSet<Supplier> Suppliers => Set<Supplier>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        // Product configuration
        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(p => p.Id);
            entity.Property(p => p.Name).IsRequired().HasMaxLength(200);
            entity.Property(p => p.Price).HasColumnType("decimal(18,2)");
            entity.HasOne(p => p.Category)
                  .WithMany(c => c.Products)
                  .HasForeignKey(p => p.CategoryId)
                  .OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(p => p.Stock)
                  .WithOne(s => s.Product)
                  .HasForeignKey<Stock>(s => s.ProductId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // User configuration
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(u => u.Id);
            entity.HasIndex(u => u.Username).IsUnique();
            entity.Property(u => u.Username).IsRequired().HasMaxLength(50);
            entity.Property(u => u.PasswordHash).IsRequired();
            entity.Property(u => u.Role).HasMaxLength(20);
        });

        // Category configuration
        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(c => c.Id);
            entity.Property(c => c.Name).IsRequired().HasMaxLength(100);
        });

        // Stock configuration
        modelBuilder.Entity<Stock>(entity =>
        {
            entity.HasKey(s => s.Id);
            entity.Property(s => s.Quantity).IsRequired();
        });

        // Invoice configuration
        modelBuilder.Entity<Invoice>(entity =>
        {
            entity.HasKey(i => i.Id);
            entity.Property(i => i.InvoiceNumber).IsRequired().HasMaxLength(50);
            entity.HasIndex(i => i.InvoiceNumber).IsUnique();
            entity.Property(i => i.TotalAmount).HasColumnType("decimal(18,2)");
            entity.HasOne(i => i.User)
                  .WithMany()
                  .HasForeignKey(i => i.UserId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // InvoiceItem configuration
        modelBuilder.Entity<InvoiceItem>(entity =>
        {
            entity.HasKey(ii => ii.Id);
            entity.Property(ii => ii.UnitPrice).HasColumnType("decimal(18,2)");
            entity.Property(ii => ii.Subtotal).HasColumnType("decimal(18,2)");
            entity.HasOne(ii => ii.Invoice)
                  .WithMany(i => i.InvoiceItems)
                  .HasForeignKey(ii => ii.InvoiceId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(ii => ii.Product)
                  .WithMany()
                  .HasForeignKey(ii => ii.ProductId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // Supplier configuration
        modelBuilder.Entity<Supplier>(entity =>
        {
            entity.HasKey(s => s.Id);
            entity.Property(s => s.Name).IsRequired().HasMaxLength(200);
            entity.Property(s => s.Phone).HasMaxLength(20);
            entity.Property(s => s.Email).HasMaxLength(200);
        });
    }
}
